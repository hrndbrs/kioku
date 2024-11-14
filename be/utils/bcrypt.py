import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def compare_password(password: str, hashed_p: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed_p.encode("utf-8"))
