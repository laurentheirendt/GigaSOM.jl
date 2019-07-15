var documenterSearchIndex = {"docs":
[{"location":"#","page":"Home","title":"Home","text":"(Image: GigaSOM.jl)","category":"page"},{"location":"#*GigaSOM.jl-Huge-scale,-high-performance-flow-cytometry-clustering-in-Julia*-1","page":"Home","title":"GigaSOM.jl - Huge-scale, high-performance flow cytometry clustering in Julia","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"With GigaSOM.jl, our novel contribution will be allowing the analysis of huge-scale clinical studies, scaling down software limitations. In order to do so, we will implement the parallelization of the FlowSOM algorithm using HPC and increase the maximum number of cells that can be processed simultaneously by the algorithm.","category":"page"},{"location":"#Package-Features-1","page":"Home","title":"Package Features","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Analysis and clustering of huge-scale flow cytometry data\nHPC-ready to handle very large datasets\nLoad and transform .fcs data files accordingly\nGigaSOM algorithm maps high-dimensional vectors into a lower-dimensional grid\nAutomatically determine the required number of cell populations using parallel computing","category":"page"},{"location":"#","page":"Home","title":"Home","text":"Check the Background section for some insights on the theory behind our package","category":"page"},{"location":"#","page":"Home","title":"Home","text":"On the Tutorial section you can find a guide explaining how to get started on GigaSOM.jl.","category":"page"},{"location":"#","page":"Home","title":"Home","text":"See the Functions section for the complete list of documented functions and types.","category":"page"},{"location":"#Contents-1","page":"Home","title":"Contents","text":"","category":"section"},{"location":"#","page":"Home","title":"Home","text":"Pages = [\"index.md\", \"background.md\", \"tutorial.md\", \"functions.md\"]","category":"page"},{"location":"background/#Background-1","page":"Background","title":"Background","text":"","category":"section"},{"location":"background/#Introduction-1","page":"Background","title":"Introduction","text":"","category":"section"},{"location":"background/#","page":"Background","title":"Background","text":"Flow cytometry clustering for several hundred million cells has long been hampered by software limitations. Julia allows us to go beyond these limits. Through the high-performance GigaSOM.jl package, we gear up for huge-scale flow cytometry analysis, softening these limitations with an innovative approach on the existing algorithm, by implementing parallel computing with stable and robust mathematical models that would run with an HPC cluster, allowing us to run cytometry datasets as big as 500 million cells.","category":"page"},{"location":"background/#","page":"Background","title":"Background","text":"(Image: GigaSOM)","category":"page"},{"location":"background/#Flow-Cytometry-1","page":"Background","title":"Flow Cytometry","text":"","category":"section"},{"location":"background/#","page":"Background","title":"Background","text":"Immunology is a very important branch of the medical and biological sciences and its research has provided critically important research techniques and tools, such as flow cytometry. The use of flow cytometry has grown substantially in the past decade, mainly due to the development of smaller, user-friendly and less expensive instruments, but also to the increase of clinical applications, like cell counting, cell sorting, detection of biomarkers or protein engineering. Flow cytometry is an immunophenotyping technique used to identify and quantify the cells of the immune system by analysing their physical and chemical characteristics in a fluid. These cells are stained with specific, fluorescently labelled antibodies and then analysed with a flow cytometer, where the fluorescence intensity is measured using lasers and photodetectors. [3] More recently, a variation of flow cytometry called mass cytometry (CyTOF) was introduced, in which antibodies are labelled with heavy metal ion tags rather than fluorochromes, breaking the limit of multiplexing capability of FACS (fluorescence-activated cell sorting) and allowing the simultaneous quantification of 40+ protein parameters within each single cell. The ability of flow cytometry and mass cytometry to analyse individual cells at high-throughput scales makes them ideal for multi-parameter cell analysis and high-speed sorting. [4]","category":"page"},{"location":"background/#","page":"Background","title":"Background","text":"(Image: FlowCytometry)\nhttps://www.creative-diagnostics.com/flow-cytometry-guide.htm","category":"page"},{"location":"background/#Self-organising-maps-(SOMs)-1","page":"Background","title":"Self-organising maps (SOMs)","text":"","category":"section"},{"location":"background/#","page":"Background","title":"Background","text":"Self-organising maps (also referred to as SOMs or Kohonen maps) are artificial neural networks introduced by Teuvo Kohonen in the 1980s. Despite of their age, SOMs are still widely used as an easy and robust unsupervised learning technique for analysis and visualisation of high-dimensional data. The SOM algorithm maps high-dimensional vectors into a lower-dimensional grid. Most often the target grid is two-dimensional, resulting into  intuitively interpretable maps. After initializing a SOM grid of size n*n, each node is initialized with a random sample (row) from the dataset (training data). For each input vector (row) in the training data the distance to each node in the grid is calculated, using Chebyshev distance or Euclidean distance equations, where the closest node is called BMU (best matching unit). The row is subsequently assigned to the BMU making it move closer to the input data, influenced by the learning rate and neighborhood Gaussian function, whilst the neighborhood nodes are also adjusted closer to the BMU. This training step is repeated for each  row in the complete dataset. After each iteration (epoch) the radius of the neighborhood function is reduced. After n epochs, clusters of nodes should have formed and as a final step, consensus cluster is used to reduce the data (SOM nodes) into m clusters. [5]","category":"page"},{"location":"background/#","page":"Background","title":"Background","text":"(Image: SOMs)\nhttp://mnemstudio.org/neural-networks-kohonen-self-organizing-maps.htm","category":"page"},{"location":"background/#Implementation-1","page":"Background","title":"Implementation","text":"","category":"section"},{"location":"background/#","page":"Background","title":"Background","text":"The high-performance GigaSOM.jl package enables the analysis and clustering of huge-scale flow cytometry data because it is HPC-ready and written in Julia, prepared to handle very large datasets. Also, the GigaSOM.jl package, provides training and visualization functions for Kohonen's self-organizing maps for Julia. Training functions are implemented in pure Julia, without depending on additional binary libraries. The SOM algorithm maps high-dimensional vectors into a lower-dimensional grid. Most often, the target grid is two-dimensional, resulting into intuitively interpretable maps. The general idea is to receive huge-scale .fcs data files as an input, load and transform them accordingly to enable the analysis and clustering of these data and automatically determine the required number of cell populations, and their sensitivity and specificity using parallel computing. In order to achieve this, GigaSOM.jl implementes a batch SOM algorithm, in which the weight vectors are only updated at the end of each epoch, and the BMU is calculated using the weight vectors from the previous epoch. Since the weight updates are not recursive, the order of the inputs does not affect the final result. In addition, there is no learning rate coefficient, which reduces the data dependency. This means that, compared to the original one, the batch algorithm has faster convergence, requires less computing, and it is the only one suitable for parallel computing. Parallel computing is the last step of our package implementation and two possible approaches exist for this kind of computation: the Model Parallelism and the Data Parallelism. In the Model Parallelism approach, the algorithm sends the same data to all the processes, and then each process is responsible for estimating different parameters and exchange their estimates with each other to come up with the right estimate for all the parameters. In the Data Parallelism approach, the algorithm distributes the data between different processes, and then each process independently tries to estimate the same parameters and then exchange their estimates with each other to come up with the right estimate. On this project, we use the Data Parallelism approaches because our nodes grid is too small for the Model Parallelism approach.","category":"page"},{"location":"background/#","page":"Background","title":"Background","text":"(Image: parallel)\nhttps://www.slideshare.net/JunyoungPark22/common-design-for-distributed-machine-learning","category":"page"},{"location":"tutorial/#Tutorial-1","page":"Tutorial","title":"Tutorial","text":"","category":"section"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"Pages = [\"tutorial.md\"]","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"GigaSOM is a package design for huge-scale high-performance flow cytometry data clustering.","category":"page"},{"location":"tutorial/#Installation-1","page":"Tutorial","title":"Installation","text":"","category":"section"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"GigaSOM can be installed using the Julia package manager. From the Julia REPL, type ] to enter the Pkg REPL mode and run","category":"page"},{"location":"tutorial/#","page":"Tutorial","title":"Tutorial","text":"pkg> add GigaSOM","category":"page"},{"location":"functions/#Functions-1","page":"Functions","title":"Functions","text":"","category":"section"},{"location":"functions/#Input-1","page":"Functions","title":"Input","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"input.jl\"]","category":"page"},{"location":"functions/#GigaSOM.readFlowset-Tuple{Any}","page":"Functions","title":"GigaSOM.readFlowset","text":"readFlowset(filenames)\n\nCreate a dictionary with filenames as keys and daFrame as values\n\nArguments:\n\nfilenames: Array of type string\n\n\n\n\n\n","category":"method"},{"location":"functions/#Process-1","page":"Functions","title":"Process","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"process.jl\"]","category":"page"},{"location":"functions/#GigaSOM.cleanNames!-Tuple{Any}","page":"Functions","title":"GigaSOM.cleanNames!","text":"cleanNames!(mydata)\n\nReplaces problematic characters in column names. Checks if the column name contains a '-' and transforms it to and '_' and it checks if the name starts with a number.\n\nArguments:\n\nmydata: dict fcsRaw or array of string\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.createDaFrame-Tuple{Any,Any,Any}","page":"Functions","title":"GigaSOM.createDaFrame","text":"createDaFrame(fcsRaw, md, panel)\n\nCreates a daFrame of type struct. Read in the fcs raw, add sample id, subset the columns and transform\n\nArguments:\n\nfcsRaw: raw FCS data\nmd: Metadata table\npanel: Panel table with a column for Lineage Markers and one for Functional Markers\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.getMarkers-Tuple{Any}","page":"Functions","title":"GigaSOM.getMarkers","text":"getMarkers(panel)\n\nReturns the lineageMarkers and functionalMarkers on a given panel\n\nArguments:\n\npanel: Panel table with a column for Lineage Markers and one for Functional Markers\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.transformData","page":"Functions","title":"GigaSOM.transformData","text":"transformData(flowframe, method = \"asinh\", cofactor = 5)\n\nTansforms FCS data. Currently only asinh\n\nArguments:\n\nflowframe: Flowframe containing daFrame per sample\nmethod: transformation method\ncofactor: Cofactor for transformation\n\n\n\n\n\n","category":"function"},{"location":"functions/#Core-1","page":"Functions","title":"Core","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"core.jl\"]","category":"page"},{"location":"functions/#GigaSOM.initGigaSOM","page":"Functions","title":"GigaSOM.initGigaSOM","text":"    initGigaSOM(train, xdim, ydim = xdim;  norm = :none, toroidal = false)\n\nInitialises a SOM.\n\nArguments:\n\ntrain: training data\nxdim, ydim: geometry of the SOM          If DataFrame, the column names will be used as attribute names.          Codebook vectors will be sampled from the training data.\nnorm: optional normalisation; one of :minmax, :zscore or :none\ntoroidal: optional flag; if true, the SOM is toroidal.\n\n\n\n\n\n","category":"function"},{"location":"functions/#GigaSOM.mapToGigaSOM-Tuple{GigaSOM.Som,DataFrames.DataFrame}","page":"Functions","title":"GigaSOM.mapToGigaSOM","text":"mapToGigaSOM(som::Som, data)\n\nReturn a DataFrame with X-, Y-indices and index of winner neuron for every row in data.\n\nArguments\n\nsom: a trained SOM\ndata: Array or DataFrame with training data.\n\nData must have the same number of dimensions as the training dataset and will be normalised with the same parameters.\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.trainGigaSOM-Tuple{GigaSOM.Som,Any}","page":"Functions","title":"GigaSOM.trainGigaSOM","text":"trainGigaSOM(som::Som, train::Any, kernelFun = gaussianKernel,\n                    r = 0.0, epochs = 10)\n\nArguments:\n\nsom: object of type Som with an initialised som\ntrain: training data\nkernel::function: optional distance kernel; one of (bubbleKernel, gaussianKernel)           default is gaussianKernel\nr: optional training radius.      If r is not specified, it defaults to √(xdim^2 + ydim^2) / 2\n\nTraining data must be convertable to Array{Float34,2} with convert(). Training samples are row-wise; one sample per row. An alternative kernel function can be provided to modify the distance-dependent training. The function must fit to the signature fun(x, r) where x is an arbitrary distance and r is a parameter controlling the function and the return value is between 0.0 and 1.0.\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.doEpoch-Tuple{Array{Float64,N} where N,Array{Float64,N} where N,Array{Float64,N} where N,Function,Number,Bool}","page":"Functions","title":"GigaSOM.doEpoch","text":"doEpoch(x::Array{Float64}, codes::Array{Float64}, dm::Array{Float64},\n        kernelFun::Function, r::Number, toroidal::Bool)\n\nvectors and the adjustment in radius after each epoch.\n\nArguments:\n\nx: training Data\ncodes: Codebook\ndm: distance matrix of all neurons of the SOM\nkernelFun: distance kernel function of type fun(x, r)\nr: training radius\ntoroidal: if true, the SOM is toroidal.\n\n\n\n\n\n","category":"method"},{"location":"functions/#Structs-1","page":"Functions","title":"Structs","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"structs.jl\"]","category":"page"},{"location":"functions/#GigaSOM.daFrame","page":"Functions","title":"GigaSOM.daFrame","text":"daFrame\n\nStructure to hold FCS files.\n\nFields:\n\nfcstable::Dict: Key: Filename, Value: FCS data table\nmd::DataFrame: Metadata containing the filenames, and experiment conditions\npanel::DataFrame: defines which markers to use (lineage, functional)\n\n\n\n\n\n","category":"type"},{"location":"functions/#GigaSOM.Som","page":"Functions","title":"GigaSOM.Som","text":"Som\n\nStructure to hold all data of a trained SOM.\n\nFields:\n\ncodes::Array{Float64,2}: 2D-array of codebook vectors. One vector per row\ncolNames::Array{String,1}: names of the attribute with which the SOM is trained\nnormParams::DataFrame: normalisation parameters for each column               of training data. Column headers corresponds with               colNames.\nnorm::Symbol: normalisation type; one of :none, :minmax, :zscore\nxdim::Int: number of neurons in x-direction\nydim::Int: number of neurons in y-direction\nnumCodes::Int: total number of neurons\ngrid::Array{Float64,2}: 2D-array of coordinates of neurons on the map         (2 columns (x,y)] for rectangular and hexagonal maps          3 columns (x,y,z) for spherical maps)\nindices::DataFrame: X-, Y-indices of the neurons\ntopol::Symbol: topology of the SOM; one of :rectangular, :hexagonal, :spherical\ntoroidal::Bool: if true, the SOM is toroidal (has no edges)\npopulation::Array{Int,1}: 1D-array of numbers of training samples mapped to               each neuron.\n\n\n\n\n\n","category":"type"},{"location":"functions/#Satellites-1","page":"Functions","title":"Satellites","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"satellites.jl\"]","category":"page"},{"location":"functions/#GigaSOM.classFrequencies-Tuple{GigaSOM.Som,Any,Any}","page":"Functions","title":"GigaSOM.classFrequencies","text":"classFrequencies(som::Som, data, classes)\n\nReturn a DataFrame with class frequencies for all neurons.\n\nArguments:\n\nsom: a trained SOM\ndata: data with row-wise samples and class information in each row\nclasses: Name of column with class information.\n\nData must have the same number of dimensions as the training dataset. The column with class labels is given as classes (name or index). Returned DataFrame has the columns:\n\nX-, Y-indices and index: of winner neuron for every row in data\npopulation: number of samples mapped to the neuron\nfrequencies: one column for each class label.\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.convertTrainingData-Tuple{Any}","page":"Functions","title":"GigaSOM.convertTrainingData","text":"convertTrainingData(data)\n\nConverts the training data to an Array of type Float64.\n\nArguments:\n\ndata: Data to be converted\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.distMatrix-Tuple{Array,Bool}","page":"Functions","title":"GigaSOM.distMatrix","text":"distMatrix(grid::Array, toroidal::Bool)\n\nReturn the distance matrix for a non-toroidal or toroidal SOM.\n\nArguments\n\ngrid: coordinates of all neurons as generated by one of the grid-functions\n\nwith x-coordinates in 1st column and y-coordinates in 2nd column.\n\ntoroidal: true for a toroidal SOM.\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.findBmu-Tuple{Array{Float64,2},Array{Float64,1}}","page":"Functions","title":"GigaSOM.findBmu","text":"findBmu(codes, sample)\n\nFind the best matching unit for a given vector, row_t, in the SOM\n\nReturns: A (bmu, bmuIdx) tuple where bmu is the high-dimensional Best Matching Unit and bmuIdx is the index of this vector in the SOM\n\nArguments\n\ncodes: 2D-array of codebook vectors. One vector per row\nsample: row in dataset / trainingsset\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.gaussianKernel-Tuple{Float64,Float64}","page":"Functions","title":"GigaSOM.gaussianKernel","text":"gaussianKernel(x::Float64, r::Float64)::Float64\n\nReturn Gaussian(x) for μ=0.0 and σ = r/3. (a value of σ = r/3 makes the training results comparable between different kernels for same values of r).\n\nArguments\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.gridRectangular-Tuple{Any,Any}","page":"Functions","title":"GigaSOM.gridRectangular","text":"gridRectangular(xdim, ydim)\n\nCreate coordinates of all neurons on a rectangular SOM.\n\nThe return-value is an array of size (Number-of-neurons, 2) with x- and y- coordinates of the neurons in the first and second column respectively. The distance between neighbours is 1.0. The point of origin is bottom-left. The first neuron sits at (0,0).\n\nArguments\n\nxdim: number of neurons in x-direction\nydim: number of neurons in y-direction\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.makeClassFreqs-Tuple{Any,Any,Any}","page":"Functions","title":"GigaSOM.makeClassFreqs","text":"makeClassFreqs(som, vis, classes)\n\nReturn a DataFrame with class frequencies for all neurons.\n\nArguments\n\nsom: a trained SOM\nvis: index of the winner neuron for each training pattern in x\nclasses: name of column with class information\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.makePopulation-Tuple{Any,Any}","page":"Functions","title":"GigaSOM.makePopulation","text":"makePopulation(numCodes, vis)\n\nReturn a vector of neuron populations.\n\nArguments\n\nnumCodes: total number of neurons\nvis: index of the winner neuron for each training pattern in x\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.normTrainData-Tuple{Array{Float64,2},Any}","page":"Functions","title":"GigaSOM.normTrainData","text":"normTrainData(x::DataFrame, normParams::DataFrame)\n\nNormalise every column of training data with the params.\n\nArguments\n\nx: DataFrame with training Data\nnormParams: Shift and scale parameters for each attribute column.\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.normTrainData-Tuple{Array{Float64,2},Symbol}","page":"Functions","title":"GigaSOM.normTrainData","text":"normTrainData(train::DataFrame, norm::Symbol)\n\nNormalise every column of training data.\n\nArguments\n\ntrain: DataFrame with training Data\nnorm: type of normalisation; one of minmax, zscore, none\n\n\n\n\n\n","category":"method"},{"location":"functions/#GigaSOM.visual-Tuple{Array{Float64,2},Array{Float64,2}}","page":"Functions","title":"GigaSOM.visual","text":"visual(codes, x)\n\nReturn the index of the winner neuron for each training pattern in x (row-wise).\n\nArguments\n\ncodes: Codebook\nx: training Data\n\n\n\n\n\n","category":"method"},{"location":"functions/#Visualisation-1","page":"Functions","title":"Visualisation","text":"","category":"section"},{"location":"functions/#","page":"Functions","title":"Functions","text":"Modules = [GigaSOM]\nPages = [\"plotting.jl\"]","category":"page"}]
}
