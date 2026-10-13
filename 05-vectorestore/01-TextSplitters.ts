import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { 
    CharacterTextSplitter, 
    RecursiveCharacterTextSplitter 
} from "@langchain/textsplitters";

const loader = new TextLoader("05-vectorestore/data/langchain-intro.txt");
const docs = await loader.load();

// const textSplitter = new CharacterTextSplitter({
//     separator: "\n\n",
//     chunkSize: 1000,
//     chunkOverlap: 200,
// });

const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 10,
});


const splits = await textSplitter.splitDocuments(docs);

console.log(splits);