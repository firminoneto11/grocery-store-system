import sqlite3


class OpenDB:
    """
    This class is meant to be used as a context manager for SQLite3. It's utilization works like the example bellow:

    import OpenDB

    with OpenDB(database='name_of_your_database.db') as cursor:
        cursor.execute('Your SQL commands here')

    When it exits the context manager, if it encounters any errors, an exception will the thrown and the changes will be
    rolled back. It it doesn't, the changes made will be committed. In both cases, the cursor and the connection will be
    closed.
    """

    def __init__(self, database):
        """
        This __init__ method initializes the connection and generates a cursor.
        :param database: The database name in which the context manager will connect.
        """
        # Storing the database name passed as an attribute
        self.database = database

        # Creating the connection and the cursor
        self.connection = sqlite3.connect(self.database)
        self.cursor = self.connection.cursor()

    def __enter__(self):
        """
        This __enter__ method returns the sqlite3 cursor to be used inside the context manager.
        :return: The SQLite3 cursor.
        """
        return self.cursor

    def __iter__(self):
        """
        This __iter__ method transforms the cursor into a iterator and yields an item at a time.
        :return: The current item in the cursor.
        """
        for item in self.cursor:
            yield item

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        This __exit__ method will be executed when the code reaches out of the context manager, and automatically will
        close both the cursor and the connection. Also, before closing, it will check if the exception value is instance
        of the Exception class, and based on that, will commit the changes if it isn't or rollback if it is.
        :param exc_type: Exception type
        :param exc_val: Exception value
        :param exc_tb: Exception traceback
        :return: None
        """
        # Closing the cursor
        self.cursor.close()

        # Checking if the exception value is instance of the Exception class
        if isinstance(exc_val, Exception):
            # Rolling back the changes made if it is
            self.connection.rollback()
        else:
            # Committing the changes if it isn't
            self.connection.commit()

        # Closing the connection
        self.connection.close()
