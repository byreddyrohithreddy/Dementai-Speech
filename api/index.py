from fastapi import FastAPI, File, UploadFile
import os
from langchain_core.output_parsers import StrOutputParser
from langchain.prompts import PromptTemplate
from langchain_community.vectorstores import DocArrayInMemorySearch
from operator import itemgetter
from langchain_community.document_loaders import PyPDFLoader
from langchain_google_genai import ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings
from pydantic import BaseModel
from langchain.docstore.document import Document

app = FastAPI()
conversation =""
llm = ""
gemini_embeddings = ""
parser = ""
chain = ""

# prompt template
template = ""
# prompt intiallization
prompt = " "

# loading pdf and splitting them
pages = ""

#vector store to store embeddings for easy retreival
vectorstore = ""

#Retriever which retrieves the values
retriever = ""

chain = ""

class Item(BaseModel):
    text:str

class Key(BaseModel):
    key:str

class Text(BaseModel):
    text:str

@app.post("/api/valid")
def key_validation(key:Key):
    global llm,gemini_embeddings,parser,chain,template,prompt
    print(key.key)
    os.environ["GOOGLE_API_KEY"]= key.key
    llm = ChatGoogleGenerativeAI(model="gemini-pro")
    gemini_embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    parser = StrOutputParser()
    chain = llm | parser

    template = """
    Answer the question based on the context below. If you can't 
    answer the question, reply "I don't know".

    Context: {context}

    Question: {question}
    """
    # prompt intiallization
    prompt = PromptTemplate.from_template(template)
    try:
        chain.invoke("tell me a joke")
        reply={"status":"true"}
    except Exception as e:
        print(e)
        reply={"status":"false"}
    return reply

@app.post("/api/python")
async def upload_pdf(text:Text):
    global llm,pages,vectorstore,retriever,chain, conversation

    conv_text = text.text
    system_message = """You are an speech store, you store the info spoke by the speaker. Your task is to structure the conversational data 
                        information from the given text and convert it into a conversation format.  
                        if the data is in a foreign language, please handle it appropriately.
                        Process the following text and provide the output in a proper format"""

    user_message = f"""Extract the following information from the provided text:\nPage content:\n\n{conv_text}\n\n """

    prompt = PromptTemplate.from_template(system_message + "\n" + user_message)

    response = llm.invoke(prompt.format(context=conv_text, question=user_message))

    conversation= conversation +"\n"+ str(response.content)
    print(conversation)
    docs =  [Document(page_content=conversation, metadata={"source": "local"})]

    vectorstore = DocArrayInMemorySearch.from_documents(docs, embedding=gemini_embeddings)
    retriever = vectorstore.as_retriever()
    chain = (
    {
        "context": itemgetter("question") | retriever,
        "question": itemgetter("question"),
    }
    | prompt
    | llm
    | parser
    )

    return {"status": "okay"}

@app.post("/api/chat")
async def chat(item:Item):
    out=chain.invoke({'question': item.text})
    print(out)
    return {"answer":out}
