
"""
    daFrame
Structure to hold FCS files.

# Fields:
- `fcstable::Dict`: Key: Filename, Value: FCS data table
- `md::DataFrame`: Metadata containing the filenames, and experiment conditions
- `panel::DataFrame`: defines which markers to use (lineage, functional)
"""
struct daFrame
    fcstable
    md::DataFrame
    panel::DataFrame
end


"""
    struct Som

Structure to hold all data of a trained SOM.

# Fields:
- `codes::Array{Float64,2}`: 2D-array of codebook vectors. One vector per row
- `colNames::Array{String,1}`: names of the attribute with which the SOM is trained
- `normParams::DataFrame`: normalisation parameters for each column
                of training data. Column headers corresponds with
                colNames.
- `norm::Symbol`: normalisation type; one of `:none, :minmax, :zscore`
- `xdim::Int`: number of neurons in x-direction
- `ydim::Int`: number of neurons in y-direction
- `nCodes::Int`: total number of neurons
- `grid::Array{Float64,2}`: 2D-array of coordinates of neurons on the map
          (2 columns (x,y)] for rectangular and hexagonal maps
           3 columns (x,y,z) for spherical maps)
- `indices::DataFrame`: X-, Y-indices of the neurons
- `topol::Symbol`: topology of the SOM; one of `:rectangular, :hexagonal, :spherical`
- `toroidal::Bool`: if `true`, the SOM is toroidal (has no edges)
- `population::Array{Int,1}`: 1D-array of numbers of training samples mapped to
                each neuron.
"""
struct Som
    codes::Array{Float64,2}
    colNames::Array{String}
    normParams::DataFrame
    norm::Symbol        # one of :none :minmax :zscore
    xdim::Int
    ydim::Int
    nCodes::Int
    grid::Array{Float64,2}
    indices::DataFrame
    topol::Symbol       # one of :rectangular :hexagonal :spherical
    toroidal::Bool
    population::Array{Int,1}

    Som(;codes::Array{Float64} = Array{Float64}(0),
        colNames::Array{String,1} = Array{String}(0),
        normParams::DataFrame = DataFrame(),
        norm::Symbol = :none,
        xdim::Int = 1,
        ydim::Int = 1,
        nCodes::Int = 1,
        grid::Array{Float64,2} = zeros(1,1),
        indices::DataFrame = DataFrame(),
        topol::Symbol = :hexagonal,
        toroidal::Bool = false,
        population::Array{Int,1} = [1]) = new(codes,
                                              colNames,
                                              normParams,
                                              norm,
                                              xdim,
                                              ydim,
                                              nCodes,
                                              grid,
                                              indices,
                                              topol,
                                              toroidal,
                                              population)
end

"""
    gridRectangular(xdim, ydim)

Create coordinates of all neurons on a rectangular SOM.

The return-value is an array of size (Number-of-neurons, 2) with
x- and y- coordinates of the neurons in the first and second
column respectively.
The distance between neighbours is 1.0.
The point of origin is bottom-left.
The first neuron sits at (0,0).
"""
function gridRectangular(xdim, ydim)

    grid = zeros(Float64, (xdim*ydim, 2))
    for ix in 1:xdim
        for iy in 1:ydim

            grid[ix+(iy-1)*xdim, 1] = ix-1
            grid[ix+(iy-1)*xdim, 2] = iy-1
        end
    end
    return grid
end


"""
    gaussianKernel(x::Float64, r::Float64)::Float64

Return Gaussian(x) for μ=0.0 and σ = r/3.
(a value of σ = r/3 makes the training results comparable between different kernels
for same values of r).
"""
function gaussianKernel(x::Float64, r::Float64)::Float64
    return Distributions.pdf.(Distributions.Normal(0.0,r/3), x)
end


"""
    distMatrix(grid::Array, toroidal::Bool)

Return the distance matrix for a non-toroidal or toroidal SOM.

# Arguments
- `grid`: coordinates of all neurons as generated by
          one of the `grid-`functions with x-coordinates in 1st column
          and y-coordinates in 2nd column.
- `toroidal`: true for a toroidal SOM.
"""
function distMatrix(grid::Array, toroidal::Bool)

    X = 1
    Y = 2
    xdim = maximum(grid[:,X]) - minimum(grid[:,X]) + 1.0
    ydim = maximum(grid[:,Y]) - minimum(grid[:,Y]) + 1.0

    numNeurons = size(grid,1)

    dm = zeros(Float64, (numNeurons,numNeurons))
    for i in 1:numNeurons
        for j in 1:numNeurons
            Δx = abs(grid[i,X] - grid[j,X])
            Δy = abs(grid[i,Y] - grid[j,Y])

            if toroidal
                Δx = min(Δx, xdim-Δx)
                Δy = min(Δy, ydim-Δy)
            end

            dm[i,j] = √(Δx^2 + Δy^2)
        end
    end
    # show(STDOUT, "text/plain",  grid)
    # show(STDOUT, "text/plain",  dm)
    return dm
end
