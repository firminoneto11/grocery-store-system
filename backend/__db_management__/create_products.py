from csv import DictReader, DictWriter
from database import OpenDB
from os.path import exists


class MockData:
    db = r'.\database.db'
    sql_file = r'.\__db_management__\script.sql'
    data = r'.\__db_management__\MOCK_DATA.csv'
    headers = ["name", "unity_price", "suppliers_percentage", "freight_percentage", "amount_in_stock", "is_active", "created_at", 
    "updated_at"]

    @classmethod
    def check_sql_file(cls):
        """
        This method checks if the sql file exists and it creates a new one if it doesn't.
        """
        if not exists(cls.sql_file):
            with open(file=cls.sql_file, mode="w", encoding="utf-8"):
                pass

    @classmethod
    def treat_data(cls):
        """
        This method treats the data mocked by mockaroo by eleminating the repeated name products.
        """
        with open(file=cls.data, mode="r", encoding="utf-8") as file:

            # Saving the product names into a list
            product_names = []
            data = []

            # Defining the dict reader for the names
            reader = DictReader(f=file, fieldnames=cls.headers)
            next(reader)
            for row in reader:
                product_names.append(row.get(cls.headers[0]))
                data.append(row)

        with open(file=cls.data, mode="w", encoding="utf-8", newline="") as new_file:
            not_repeated = []
            repeated = []

            # Algorithm to separate repeated from the not repeated
            for row in data:

                if product_names.count(row.get(cls.headers[0])) == 1:
                    not_repeated.append(row)
                    continue

                already_in = list(filter(lambda el: el[cls.headers[0]] == row[cls.headers[0]], repeated))
                if len(already_in) == 0:
                    repeated.append(row)    

            # Instanciating the DictWriter and writing the headers
            writer = DictWriter(f=new_file, fieldnames=cls.headers)
            writer.writeheader()

            # Saving the not repeated data and one of each repeated
            for row in not_repeated:
                writer.writerow(row)
            if len(repeated) > 0:
                print(f"\nFound {len(repeated)} products repeated:")
                for row in repeated:
                    print(f"'{row[cls.headers[0]]}' found more than once!")
                    writer.writerow(row)


    @classmethod
    def create_sql_file(cls):
        """
        This method created a set of sql commands in order to populate the database. The data was mocked by:
        -> https://www.mockaroo.com/
        """

        # Checking if the sql file exists
        cls.check_sql_file()

        # Eliminating repeated products
        cls.treat_data()

        # Script Generation
        with open(file=cls.data, mode="r", encoding="utf-8") as data:
            with open(file=cls.sql_file, mode="w", encoding="utf-8") as sql:
                data = DictReader(f=data, fieldnames=cls.headers)
                next(data)

                for row in data:
                    row[cls.headers[5]] = 1 if row.get(cls.headers[5]) == "true" else 0
                    statement = f"""INSERT INTO PRODUCTS (
                        name, unity_price, suppliers_percentage, freight_percentage, amount_in_stock, is_active, created_at,
                        updated_at, description) VALUES (
                        '{row.get(cls.headers[0])}',
                        '{row.get(cls.headers[1])}',
                        '{row.get(cls.headers[2])}',
                        '{row.get(cls.headers[3])}',
                        '{row.get(cls.headers[4])}',
                        '{row.get(cls.headers[5])}',
                        '{row.get(cls.headers[6])}',
                        '{row.get(cls.headers[6])}',
                        '');\n"""
                    sql.write(statement)

    @classmethod
    def execute(cls):

        # Creating the sql script
        cls.create_sql_file()

        # Executing it
        with OpenDB(database=cls.db) as cursor:
            with open(file=cls.sql_file, mode="r", encoding="utf-8") as query:

                # Reseting the table PRODUCTS
                cursor.execute(
                    """
                    DELETE FROM PRODUCTS;
                    """
                )
                cursor.execute(
                    """
                    UPDATE sqlite_sequence SET seq = 0 WHERE NAME = 'PRODUCTS';
                    """
                )

                query = query.read()
                query = query.split(";")
                try:
                    for line in query:
                        cursor.execute(line)
                except Exception as error:
                    print(f"\nAn error occurred: {error}\n")
                else:
                    print("\nDatabase populated successfully!\n")


if __name__ == "__main__":
    MockData.execute()
