from azure.data.tables.aio import TableServiceClient, TableClient
from azure.data.tables import UpdateMode
from azure.core.exceptions import ResourceNotFoundError
from utils import Configuration
from models import ConfigurationTypes
import logging

class TableRepository:
    def __init__(self, entity_type):
        _config = Configuration()
        self.table_name = f"{entity_type.__name__}s"
        self.conn_str = _config.get_config_values(ConfigurationTypes.ConnectionString.value)
        service_client = TableServiceClient.from_connection_string(self.conn_str)
        self.client = service_client.get_table_client(table_name=self.table_name)
        
    async def init(self):
        """
        Creates the table asynchronously if it doesn't already exist.
        """
        try:
            await self.client.create_table()
            logging.info(f"Table '{self.table_name}' created successfully.")
        except Exception as e:
            logging.info(f"Table already exists or error creating table: {e}")

    async def upsert_async(self, entity):        
        try:
            await self.client.upsert_entity(entity, mode=UpdateMode.MERGE)
            return await self.get_async(entity['PartitionKey'], entity['RowKey'])
        except Exception as e:
            logging.error(f"{str(e)}")

    async def get_async(self, partition_key, row_key):        
        try:
            entity = await self.client.get_entity(partition_key, row_key)
            return entity
        except ResourceNotFoundError:
            logging.warning(f"Entity not found for PartitionKey: {partition_key}, RowKey: {row_key}")
            return None    

    async def query_async(self, filter_query: str):        
        try:
            entities = []
            async for entity in self.client.query_entities(query_filter=filter_query):
                entities.append(entity)
            return entities
        except Exception as e:
            logging.error(f"Error querying entities: {str(e)}")
            return []
        
    async def delete_async(self, partition_key, row_key):       
        try:           
            await self.client.delete_entity(partition_key=partition_key, row_key=row_key)
            logging.info(f"Entity successfully deleted: PartitionKey={partition_key}, RowKey={row_key}")
            return True
        except ResourceNotFoundError:
            logging.warning(f"Entity not found for PartitionKey: {partition_key}, RowKey: {row_key}")
            return False
        except Exception as e:
            logging.error(f"An error occurred while deleting the entity: {e}")
            return False
