location = ENV["HOME"]*"/artificial_data_cytof"
binFileType = ".jls"
nWorkers = 3

fileDir = readdir(location)

mdFileName = location*"/metadata.xlsx"
panelFileName = location*"/panel.xlsx"

using GigaSOM, FileIO, Test, Serialization
md = GigaSOM.DataFrame(GigaSOM.XLSX.readtable(mdFileName, "Sheet1")...)
panel = GigaSOM.DataFrame(GigaSOM.XLSX.readtable(panelFileName, "Sheet1")...)

# read in the entire dataset
in = readFlowset(md.file_name)
fileNames = collect(keys(in))

@info " > Input: $(length(fileNames)) files"

# get the total size of the data set
totalSize = 0
inSize = []
for name in fileNames
    global totalSize
    totalSize += size(in[name])[1]
    push!(inSize, size(in[name])[1])
end

# determine the size per file
fileL = Int(floor(totalSize/nWorkers))

# determine the size of the last (residual) file
lastFileL = Int(fileL + totalSize - nWorkers * fileL)

@info " > # of workers: $nWorkers"
@info " > Regular row count: $fileL cells"
@info " > Last file row count: $lastFileL cells"

# determine the running sum of the file sizes
runSum = []
tmpSum = 0
for indivSize in inSize
    global tmpSum
    tmpSum += indivSize
    push!(runSum, tmpSum)
end

# establish an index map
limitFileIndex = 0
fileEnd = 1
for worker in 1:nWorkers
    global limitFileIndex, md, fileEnd
    iStart = Int((worker - 1) * fileL + 1)
    iEnd = Int(worker * fileL)

    if worker == nWorkers
        iEnd = iStart + lastFileL - 1
    end
    @info " -----------------------------"
    @info " >> Generating input-$worker.jls"
    @info " -----------------------------"
    @info " > iStart: $iStart; iEnd: $iEnd"

    fileStart = fileEnd
    for (k, tmpSum) in enumerate(runSum)
        if tmpSum >= iEnd
            @info " + Break point file: $(md.file_name[k])"
            fileEnd = k
            break;
        end
    end
    if worker == nWorkers
        fileEnd = length(md.file_name)
    end

    @info " > fileStart: $fileStart; fileEnd: $fileEnd"
end

# split the file properly speaking
#=
out = Dict()
for key in keyArray
    out[key] = df.data[key][1:fileL]
end

open(f -> serialize(f,out), "out.jls", "w")
y = open(deserialize, "out.jls")
@test y == outa
=#
