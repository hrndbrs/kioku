from io import TextIOWrapper
import json
from typing import Any, Dict, List, Tuple

DB = Dict[str, Any]


class BaseService:
    db: List[DB]
    table_name: str
    db_path: str
    file: TextIOWrapper

    def __init__(self, table_name: str) -> None:
        self.table_name = table_name
        self.db_path = f"db/{table_name}.json"
        self.db, self.file = self._connect_to_db()

    def _connect_to_db(self) -> Tuple[List[DB], TextIOWrapper]:
        f = open(self.db_path, "r+")
        db = json.load(f)

        return db, f


class IDIndexService:
    db: Dict[str, int]
    file: TextIOWrapper
    _available_keys = ["decks", "cards"]

    def __init__(self) -> None:
        self.db, self.file = self._connect_to_db()

    def _connect_to_db(self):
        f = open("db/id_index.json", "r+")
        db = json.load(f)

        return (db, f)

    def get_id(self, key: str) -> int:
        try:
            return self.db[key]
        except KeyError:
            return 0

    def overwrite(self, **kwargs: int) -> "IDIndexService":
        for k in kwargs:
            if k in self._available_keys:
                self.db[k] = kwargs[k] if kwargs[k] > self.db[k] else self.db[k]

        self.file.seek(0)
        self.file.truncate()
        json.dump(self.db, self.file, indent=2)

        return self
