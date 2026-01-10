// Import the Pinecone library
const { Pinecone } = require('@pinecone-database/pinecone');

// Initialize a Pinecone client with your API key
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

const chatgptproject = pc.index('chatgptproject'); // this is the index name

// this function stores the message in the vector database
async function createMemory({ vectors, metadata, messageId }) {
    await chatgptproject.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }]);
};

// this function queries the vector database
async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await chatgptproject.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? metadata : undefined,
        includeMetadata: true
    });

    return data.matches;
};

module.exports = {
    createMemory,
    queryMemory
};