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
        # create update query
        for key, value in updates.items():
            items += (value,)
            set_query += "{} = ? AND ".format(key)

        set_query = set_query.removesuffix(" AND ")
        # create where query
        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ? AND ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(" AND ")

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
        # create where query
        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ? AND ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(" AND ")

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
            # create where query
            where_query = ""
            for key, (sign, value) in where.items():
                if value is not None:
                    where_query += "{} {} ? AND ".format(key, sign)
                    items += (value,)
            where_query = where_query.removesuffix(" AND ")
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

    def create_room(self, tier:Literal['basic'] | Literal['buciness'] | Literal['vip'], capacity:Literal[1] | Literal[2],
        smoking: bool, kitchen: bool, price: float, number:int):
        # throw if something is missing
        for arg in [tier, capacity, smoking, kitchen, price, number]:
            if arg == None:
                raise RuntimeError("Missing Arguments")
        
        cursor = self.conn.cursor()

        cursor.execute("""
        INSERT INTO Room (tier, capacity, smoking, kitchen, price, number)
        VALUES (?, ?, ?, ?, ?, ?);
        """, (tier, capacity, smoking, kitchen, price, number))
        
        self.conn.commit()

        cursor.close()

    def create_booking(self, f_name:str, l_name:str, address_1:str, address_2:str, city:str, state:str, zip_code:str, phone:str, email:str, check_in:str, check_out:str, 
                    checkin_key:str, room_id:int = -1):
        # throw if something is missing.
        for arg in [f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, checkin_key, room_id]:
            if arg is None:
                raise RuntimeError("Missing required booking info.")
        
        
        
        cursor = self.conn.cursor()
        
        if room_id == -1:
            cursor.execute(f"""
            SELECT r.id
            FROM Room AS r
            LEFT JOIN Booking AS b ON r.id = b.room_id
            WHERE b.room_id IS NULL;
            """)
            room_id = cursor.fetchone()["id"]
            
            self.conn.commit()

        cursor.close()
        # Throw if booking dates overlap
        if self.check_date_overlap(check_in, check_out, room_id):
            raise RuntimeError("Your check-in and check-out times for the requested room overlap with another guest's check-in and check-out times for that room.")


        cursor = self.conn.cursor()
        

        cursor.execute(f"""
        INSERT INTO Booking (f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, checkin_key, room_id)
        VALUES ({('?, '*13).removesuffix(', ')});
        """, (f_name, l_name, address_1, address_2, city, state, zip_code, phone, email, check_in, check_out, checkin_key, room_id))
        
        self.conn.commit()

        cursor.close()

    def get_booking(self, where:dict[str, tuple[Literal["=", "<", ">", ">=", "<="], str|int]]):
        rem_list = []
        # remove Nones
        for k, (s, v) in where.items():
            if v is None:
                rem_list.append(k)

        for rem in rem_list:
            del where[rem]
        
        cursor = self.conn.cursor()
        
        items = ()
        bookings = []
        print(where)

        if where is not None and len(where) > 0:
            # create where query
            where_query = ""
            for key, (sign, value) in where.items():
                if value is not None:
                    where_query += "{} {} ? AND ".format(key, sign)
                    items += (value,)
            where_query = where_query.removesuffix(" AND ")
            if len(items) > 0:
                cursor.execute(f"""
                SELECT * FROM Booking
                WHERE {where_query};
                """, items)
            else:
                cursor.execute(f"""
            SELECT * FROM Booking;
            """, items)

            bookings = cursor.fetchone()
            
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
        # create set
        for key, value in updates.items():
            if value is not None:
                items += (value,)
                set_query += "{} = ?, ".format(key)

        set_query = set_query.removesuffix(", ")
        # create where query
        where_query = ""
        for key, (sign, value) in where.items():
            if value is not None:
                where_query += "{} {} ? AND ".format(key, sign)
                items += (value,)
        where_query = where_query.removesuffix(" AND ")

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
        # create where query
        where_query = ""
        for key, (sign, value) in where.items():
            where_query += "{} {} ? AND ".format(key, sign)
            items += (value,)
        where_query = where_query.removesuffix(" AND ")

        cursor.execute(f"""
        DELETE FROM Booking
        WHERE {where_query};
        """, items)
        
        self.conn.commit()

        cursor.close()

    def check_date_overlap(self, check_in:str, check_out:str, room_id:int) -> bool:
        cursor = self.conn.cursor()

        cursor.execute("""
        SELECT COUNT(*) FROM Booking WHERE
        ((check_in <= ? AND check_out >= ?) OR
        (check_in <= ? AND check_out >= ?) OR
        (check_in >= ? AND check_out <= ?)) AND room_id = ?;
        """,
        (check_out, check_in, check_in, check_out, check_in, check_out, room_id))
        overlap_count = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()

        return overlap_count > 0

    def create_db(self):
        cursor = self.conn.cursor()

        # Define SQL commands to create tables if they do not exist
        create_tables_sql = """
        CREATE TABLE IF NOT EXISTS Room (
            id INTEGER PRIMARY KEY,
            tier TEXT NOT NULL CHECK(tier IN ('basic', 'business', 'vip')),
            capacity INTEGER NOT NULL CHECK(capacity IN (1, 2)),
            smoking INTEGER NOT NULL,
            kitchen INTEGER NOT NULL,
            price REAL NOT NULL,
            number INTEGER NOT NULL UNIQUE
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
            checkin_key CHAR(64) NOT NULL,
            room_id INTEGER NOT NULL,
            FOREIGN KEY (room_id) REFERENCES Room(id),
            CHECK (check_out > check_in)
        );

        CREATE TRIGGER IF NOT EXISTS ensure_future_check_in
        BEFORE INSERT ON Booking
        FOR EACH ROW
        BEGIN
            SELECT
                CASE
                    WHEN NEW.check_in < DATE('now') THEN
                        RAISE (ABORT, 'check_in must be after the current date')
                END;
        END;

        CREATE TRIGGER IF NOT EXISTS ensure_future_check_in_update
        BEFORE UPDATE ON Booking
        FOR EACH ROW
        BEGIN
            SELECT
                CASE
                    WHEN NEW.check_in <= DATE('now') THEN
                        RAISE (ABORT, 'check_in must be after the current date')
                END;
        END;

        """

        # Execute the SQL commands
        cursor.executescript(create_tables_sql)

        # Commit the changes
        self.conn.commit()
        
        cursor.close()