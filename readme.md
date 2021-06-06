In order to start the service, you need to install a node at least version 15.2. 
Since the project is in the repository without the node_modules folder, you need to install it once, 
    install the dependencies with the command npm install
Go to the service folder and execute the command: npm run start.

The service has a configuration file where you can set operation parameters:
listening port, temporary folder, validation parameters: 
minimum and maximum sequence length, GCRatio parameters, subsequence length and maximum GCRatio difference in a subsequence.

Since there can be a lot of data (gigabytes), in order not to store the data in memory, we first upload all the data to a file, and then we will parse it in the stream.
