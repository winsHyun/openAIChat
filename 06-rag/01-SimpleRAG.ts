import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai"
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//import { ChatPromptTemplate } from "@langchain/core/prompts"
import { PromptTemplate } from "@langchain/core/prompts";

import * as hub from "langchain/hub/node";

import { createStuffDocumentsChain } from "@langchain/classic/chains/combine_documents"                                           
import { StringOutputParser } from "@langchain/core/output_parsers"
import OpenAI from "openai"
import "dotenv/config"

// 1. Indexing
// (1) Load
const loader = new TextLoader("05-vectorestore/data/langchain-intro.txt");
const docs = await loader.load()

// (2) Split
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
})
const splits = await textSplitter.splitDocuments(docs)

// (3) Store
const vectorStore = await MemoryVectorStore.fromDocuments(
  splits,
  new OpenAIEmbeddings()
)

// 2. Retrieval and generation
// (1) Retrieve
const query = "LangChain은 언제 활용해?"
const retriever = vectorStore.asRetriever()
const retrievedDocs = await retriever.invoke(query)

// (2) Generate
// langchain hub 프롬프트 확인

const prompt = PromptTemplate.fromTemplate(`
다음 문맥을 바탕으로 질문에 답변하세요.
문맥에 답이 없으면 모른다고 답변하세요.

문맥:
{context}

질문:
{question}
`);

const llm = new ChatOpenAI({ model: "gpt-4o-mini", temperature: 0 })
const ragChain = await createStuffDocumentsChain({
  llm,
  prompt,
  outputParser: new StringOutputParser(),
})

// langsmith trace 확인
const result = await ragChain.invoke({
  question: query,
  context: retrievedDocs,
})
console.log(result)