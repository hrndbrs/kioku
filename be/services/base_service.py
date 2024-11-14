import json
from io import TextIOWrapper
from typing import Any, Dict, Generic, List, Tuple, TypeVar

from models.common import CommonModel


DB = Dict[str, Any]
T = TypeVar("T", bound=CommonModel)


class IDIndexService:
    db: Dict[str, int]
    _available_keys = ["decks", "cards", "users"]

    def __init__(self) -> None:
        self.db, f = self._connect_to_db()
        f.close()

    def _connect_to_db(self):
        f = open("db/id_index.json", "r+")
        db = json.load(f)

        return (db, f)

    def get_id(self, key: str) -> int:
        try:
            return self.db[key]
        except KeyError:
            return 0

    def overwrite(self, key: str, id: int) -> "IDIndexService":
        file = self._connect_to_db()[1]
        if key in self._available_keys:
            self.db[key] = id if id > self.db[key] else self.db[key]

        file.seek(0)
        file.truncate()
        json.dump(self.db, file, indent=2)
        file.close()
        return self


class BaseService(Generic[T]):
    table_name: str
    file: TextIOWrapper
    models: List[T]
    ClassModel: type[T]

    def __init__(self, table_name: str, ClassModel: type[T]) -> None:
        self.ClassModel = ClassModel
        self.table_name = table_name
        db, f = self._connect_to_db()
        self.models = [self.ClassModel(**data) for data in db]
        f.close()

    def _connect_to_db(self) -> Tuple[List[DB], TextIOWrapper]:
        f = open(f"db/{self.table_name}.json", "r+")
        db = json.load(f)
        return db, f

    def get_by_attr(self, **kwargs: Any):
        key, val = next(iter(kwargs.items()))
        return [model for model in self.models if model.get_attr(key) == val]

    def add(self, new_entry: T) -> "BaseService":
        self.models = [*self.models, new_entry]
        return self

    def delete_by_id(self, id: int) -> T:
        deleted = next(model for model in self.models if model.id == id)
        self.models
        return deleted

    def save(self, id_service: IDIndexService) -> "BaseService":
        file = self._connect_to_db()[1]
        self.models.sort(key=lambda m: m.id)
        file.seek(0)
        file.truncate()

        json.dump(
            [
                {
                    "id": model.id,
                    **{field: model.get_attr(field) for field in model.fields},
                }
                for model in self.models
            ],
            file,
            indent=2,
        )

        file.close()

        id_service.overwrite(self.table_name, self.models[-1].id)
        return self
