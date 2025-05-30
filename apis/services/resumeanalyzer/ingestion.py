from fastapi import UploadFile
from ..database import AzureBlobServices, PineConeService, TableRepository
from ..ai import OpenAIServices
from utils import read_from_file, chunk_content, PromptTemplate
from models import ChunkingTypes, ExtractorTypes
from data import Files, Questionnaire
from dataclasses import asdict
import logging
from typing import List
import asyncio
import uuid
import json

class Ingestion:
    def __init__(self):
        self._azure_storage_service = AzureBlobServices()
        self._openai_service = OpenAIServices()
        self._pinecone_service = PineConeService()
        self._prompt_template_service = PromptTemplate()
        self._azuretableserviceclient = TableRepository(Files)
        self._acuretableserviceclient_questions = TableRepository(Questionnaire)

    async def Upload_and_Vectorize(self, file_bytes: bytes, sourceid: str, filename: str, file: UploadFile, file_extension: str, resumeid: str):
        #uploading file to azure cloud servive        
        try:            
            await self._azure_storage_service.init()
            await self._azuretableserviceclient.init()
            await self._acuretableserviceclient_questions.init()
            public_url = await self._azure_storage_service.upload_file(resumeid = resumeid, blob_name = filename, file_stream = file)           
        except Exception as e:
            return {"file": filename, "status": "failed at uploading to azure blob container", "error": str(e)}
        
        #calling exraction service
        try:
            content = ""
            if (file_extension == ".pdf"):
                content = read_from_file(ExtractorTypes.pdf, file_bytes)            
        except Exception as e:
            return {"file":filename, "status": "failed at extracting content", "error": str(e)}
        
        await asyncio.gather(
            self.process_resume(content=content, sourceid=sourceid, resumeid=resumeid, filename=filename, url=public_url),
            self.process_questions(content=content, sourceid=sourceid, resumeid=resumeid, filename=filename, url=public_url)
        )

        chunks = chunk_content(chunking_type = ChunkingTypes.Recursive, text = content)

        try:
            vectors = await self.process_chunks(chunks = chunks, filename = filename, resumeid = resumeid, public_url = public_url, sourceid = sourceid)
        except Exception as e:
            return {"file": filename, "status": "failed at creating vectors", "error": str(e)}
        
        try:
            self._pinecone_service.upsert_vectors(vectors)
        except Exception as e:
            return {"file": filename, "status": "failed at uploading vectors", "error": str(e)}
        
        return {"file":filename, "status":"Completely Processd successfully"}

    async def process_chunks(self, chunks: List[str], filename: str, resumeid: str, public_url: str, sourceid: str):        
        embedding_tasks = []
        for chunk in chunks:
            task = self._openai_service.EmbeddingsOpenAI(text = chunk)
            embedding_tasks.append(task)
        vectors = await asyncio.gather(*embedding_tasks)       
        return [{
            "id": str(uuid.uuid4()),
            "values": vector,
            "metadata": {
                "filename": filename,
                "sourceid": sourceid,
                "resumeid": resumeid,
                "filepath": public_url,
                "chunk_content": chunk
            }
        } for vector, chunk in zip(vectors, chunks)]   

    async def process_resume(self, content: str, resumeid: str,sourceid:str, filename: str, url: str):
        try:
            prompts = self._prompt_template_service.create_a_prompt_template(content = content, promptType = "summary")
            response = await self._openai_service.ChatCompletion(user_prompt=prompts["user_prompt"], 
                                                             system_prompt=prompts["system_prompt"],
                                                             json_mode = True) 
            AIresponse = json.loads(response)
            file_data = Files(
                PartitionKey = sourceid,
                RowKey = resumeid,
                filename= filename,
                filepath= url,
                uploadedby="Test User",
                fileid= "FILE-001",
                filesource="LinkedIn",
                username="Test User",
                resumecontent=content,
                resumesummary=AIresponse['summary'],
                personaldetails=AIresponse['personaldetails'],
                skills=AIresponse['skills'],
                professionalexperience=AIresponse['professionalexperience'],
                educationalbackground=AIresponse['educationalbackground'],
                certifications=AIresponse['certifications'],
                achievements=AIresponse['achievements'],
                interests=AIresponse['interests'],
            )
            files_dict = dict(file_data)
            await self._azuretableserviceclient.upsert_async(files_dict)   
        except Exception as e:
            logging.error(f"An error occurred while processing file {e}")

    async def process_questions(self, content: str, resumeid: str,sourceid:str, filename: str, url: str):
        try:
            prompts = self._prompt_template_service.create_a_prompt_template(content = content, promptType = "questions")
            response = await self._openai_service.ChatCompletion(user_prompt=prompts["user_prompt"], 
                                                             system_prompt=prompts["system_prompt"],
                                                             json_mode = True) 
            AIresponse = json.loads(response)
            data_dict = {item["category"]: json.dumps(item["questions"]) for item in AIresponse["questions"]}
            question_data = Questionnaire(
                PartitionKey = sourceid,
                RowKey = resumeid,
                url = url,
                filename = filename,
                introductory = data_dict["introductory"],
                experience = data_dict["experience"],
                technical = data_dict["technical"],
                education = data_dict["education"],
                extra = data_dict["extra"],
                interests = data_dict["interests"]
            )
            questions_dict = dict(question_data)
            await self._acuretableserviceclient_questions.upsert_async(questions_dict)
        except Exception as e:
            logging.error(f"An error occurred while processing the resume for questions {e}")
