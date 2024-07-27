import sqlite3 as sql
from typing import Literal

class DataBase:
    def __init__(self) -> None:
        self.conn = sql.connect('./db/hotel.db')
        self.create_db()
        
        self.conn.row_factory = sql.Row

    def close(self):
        self.conn.close()

    def update_room(self, updates:dict[str, str|int], where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        cursor = self.conn.cursor()
        items = ()

        set_query = ""

        for key, value in updates.items():
            items += (value,)
            set_query += "{} = ?, ".format(key)

        set_query = set_query.removesuffix(", ")

        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ?, ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(", ")

        cursor.execute(f"""
        UPDATE Room
        SET {set_query}
        WHERE {where_query};
        """, items)
        
        self.conn.commit()

        cursor.close()

    def delete_room(self, where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        cursor = self.conn.cursor()
        
        items = ()

        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ?, ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(", ")

        cursor.execute(f"""
        DELETE FROM Room
        WHERE {where_query};
        """, items)
        
        self.conn.commit()

        cursor.close()

    def get_room(self, where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]] | None):
        cursor = self.conn.cursor()
        
        items = ()
        rooms = []

        if where is not None and len(where) > 0:

            where_query = ""
            for key, (sign, value) in where.items():
                if value is not None:
                    where_query += "{} {} ?, ".format(key, sign)
                    items += (value,)
            where_query = where_query.removesuffix(", ")

            cursor.execute(f"""
            SELECT * FROM Room
            WHERE {where_query};
            """, items)

            rooms = cursor.fetchall()
            
            self.conn.commit()
        
        else:

            cursor.execute(f"""
            SELECT * FROM Room;
            """, items)

            rooms = cursor.fetchall()
            
            self.conn.commit()

        cursor.close()

        return rooms

    def create_room(self, tier:Literal['basic'] | Literal['buciness'] | Literal['vip'], capacity:Literal[1] | Literal[2]):
        for arg in [tier, capacity]:
            if arg == None:
                raise RuntimeError("Missing Arguments")
        
        cursor = self.conn.cursor()

        cursor.execute("""
        INSERT INTO Room (tier, capacity)
        VALUES (?, ?);
        """, (tier, capacity))
        
        self.conn.commit()

        cursor.close()

    def create_booking(self, f_name:str, l_name:str, address_1:str, address_2:str, city:str, state:str, zip_code:str, phone:str, email:str, check_in:str, check_out:str, 
                    tier:Literal['basic', 'buciness', 'vip'], capacity:Literal[1] | Literal[2], checkin_key:str, room_id:int):
        for arg in [f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, tier, capacity, checkin_key, room_id]:
            if arg == None:
                raise RuntimeError("Missing Arguments")
        
        cursor = self.conn.cursor()

        cursor.execute(f"""
        INSERT INTO Booking (f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, tier, capacity, checkin_key, room_id)
        VALUES ({('?, '*15).removesuffix(', ')});
        """, (f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, tier, capacity, checkin_key, room_id))
        
        self.conn.commit()

        cursor.close()

    def get_booking(self, where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        cursor = self.conn.cursor()
        
        items = ()
        bookings = []

        if where is not None and len(where) > 0:

            where_query = ""
            for key, (sign, value) in where.items():
                if value is not None:
                    where_query += "{} {} ?, ".format(key, sign)
                    items += (value,)
            where_query = where_query.removesuffix(", ")
            if len(items) > 0:
                cursor.execute(f"""
                SELECT * FROM Booking
                WHERE {where_query};
                """, items)
            else:
                cursor.execute(f"""
            SELECT * FROM Booking;
            """, items)

            bookings = cursor.fetchall()
            
            self.conn.commit()
        else:
            cursor.execute(f"""
            SELECT * FROM Booking;
            """, items)

            bookings = cursor.fetchall()
            
            self.conn.commit()

        cursor.close()

        return bookings
    
    def update_booking(self, updates:dict[str, str|int], where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        cursor = self.conn.cursor()
        items = ()

        set_query = ""

        for key, value in updates.items():
            if value is not None:
                items += (value,)
                set_query += "{} = ?, ".format(key)

        set_query = set_query.removesuffix(", ")

        where_query = ""
        for key, (sign, value) in where.items():
            if value is not None:
                where_query += "{} {} ?, ".format(key, sign)
                items += (value,)
        where_query = where_query.removesuffix(", ")

        cursor.execute(f"""
        UPDATE Booking
        SET {set_query}
        WHERE {where_query};
        """, items)
        
        self.conn.commit()

        cursor.close()

    def delete_booking(self, where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        cursor = self.conn.cursor()
        
        items = ()

        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ?, ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(", ")

        cursor.execute(f"""
        DELETE FROM Booking
        WHERE {where_query};
        """, items)
        
        self.conn.commit()

        cursor.close()

    def create_db(self):
        cursor = self.conn.cursor()

        # Define SQL commands to create tables if they do not exist
        create_tables_sql = """

        CREATE TABLE IF NOT EXISTS Room (
            id INTEGER PRIMARY KEY,
            tier TEXT NOT NULL CHECK(tier IN ('basic', 'business', 'vip')),
            capacity INTEGER NOT NULL CHECK(capacity IN (1, 2))
        );

        CREATE TABLE IF NOT EXISTS Booking (
            id INTEGER PRIMARY KEY,
            f_name varchar(2,30) NOT NULL,
            l_name varchar(2,30) NOT NULL,
            address_1 TEXT NOT NULL,
            address_2 TEXT NOT NULL,
            city TEXT NOT NULL,
            state TEXT NOT NULL,
            zip_code TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT NOT NULL,
            check_in DATE NOT NULL,
            check_out DATE NOT NULL,
            tier TEXT NOT NULL CHECK(tier IN ('basic', 'buciness', 'vip')),
            capacity INTEGER NOT NULL CHECK(capacity IN (1, 2)),
            checkin_key CHAR(64) NOT NULL,
            room_id INTEGER UNIQUE,
            FOREIGN KEY (room_id) REFERENCES Room(id)
        );
        """

        # Execute the SQL commands
        cursor.executescript(create_tables_sql)

        # Commit the changes
        self.conn.commit()
        
        cursor.close()