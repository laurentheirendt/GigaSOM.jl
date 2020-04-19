"""
    loadFCSHeader(fn::String)::Tuple{Vector{Int}, Dict{String,String}}

Efficiently extract data offsets and keyword dictionary from an FCS file.
"""
function loadFCSHeader(fn::String)::Tuple{Vector{Int}, Dict{String,String}}
    open(fn) do io
        offsets = FCSFiles.parse_header(io)
        params = FCSFiles.parse_text(io, offsets[1], offsets[2])
        FCSFiles.verify_text(params)
        (offsets, params)
    end
end

"""
    getFCSSize(offsets, params)::Tuple{Int,Int}

Convert the offsets and keywords from an FCS file to cell and parameter count,
respectively.
"""
function getFCSSize(offsets, params)::Tuple{Int,Int}
    nData = parse(Int, params["\$TOT"])
    nParams = parse(Int, params["\$PAR"])

    if params["\$DATATYPE"]!="F"
        @error "Only float32 FCS files are currently supported"
        error("Unsupported FCS format")
    end

    beginData = parse(Int, params["\$BEGINDATA"])
    endData = parse(Int, params["\$ENDDATA"])

    #check that the $TOT and $PAR look okay
    if !(offsets[3]==0 && offsets[4]==0) &&
        ((1+offsets[4]-offsets[3] != nData*nParams*4 &&
        offsets[4]-offsets[3] != nData*nParams*4) ||
        offsets[3]!=beginData || offsets[4] != endData)
        @warn "Data size mismatch, FCS is likely broken."
    end

    return (nData, nParams)
end

"""
    loadFCSSizes(fns::Vector{String})

Load cell counts in many FCS files at once. Useful as input for `slicesof`.
"""
function loadFCSSizes(fns::Vector{String})
    [(begin
        o,s = loadFCSHeader(fn)
        getFCSSize(o,s)[1]
      end
     ) for fn in fns]
end

"""
    loadFCS(fn::String; applyCompensation::Bool=true)::Tuple{Dict{String,String}, Matrix{Float64}}

Read a FCS file. Return a tuple that contains in order:

- dictionary of the keywords contained in the file
- raw column names
- prettified and annotated column names
- raw data matrix

If `applyCompensation` is set, the function parses and retrieves a spillover
matrix (if any valid keyword in the FCS is found that would contain it) and
applies it to compensate the data.
"""
function loadFCS(fn::String; applyCompensation::Bool=true)::Tuple{Dict{String,String}, Matrix{Float64}}
    fcs = FileIO.load(fn)
    meta = getMetaData(fcs.params)
    data = hcat(map(x->Vector{Float64}(fcs.data[x]), meta[:,:N])...)
    if applyCompensation
        spill = getSpillover(fcs.params)
        if spill!=nothing
            names, mtx = spill
            cols = indexin(names, meta[:,:N])
            if any(cols.==nothing)
                @error "Unknown columns in compensation matrix" names cols
                error("Invalid compensation matrix")
            end
            compensate!(data, mtx, Vector{Int}(cols))
        end
    end
    return (fcs.params, data)
end

"""
    loadFCSSet(name::Symbol, fns::Vector{String}, pids=workers(); applyCompensation=true)::LoadedDataInfo

This runs the FCS loading machinery in a distributed way, so that the files
`fns` (with full path) are sliced into equal parts and saved as a distributed
variable `name` on workers specified by `pids`.

`applyCompensation` is passed to loadFCS function.

See `slicesof` for description of the slicing.

The loaded dataset can be manipulated by the distributed functions, e.g.
- `dselect` for removing columns
- `dscale` for normalization
- `dtransform_asinh` (and others) for transformation
- etc.
"""
function loadFCSSet(name::Symbol, fns::Vector{String}, pids=workers(); applyCompensation=true)::LoadedDataInfo
    slices = slicesof(loadFCSSizes(fns), length(pids))
    distributed_foreach(slices,
        (slice) -> Base.eval(Main, :(
            begin
                $name = vcollectSlice((i)->last(loadFCS($fns[i]; applyCompensation=$applyCompensation)), $slice)
                nothing
            end
        )), pids)
    return LoadedDataInfo(name, pids)
end