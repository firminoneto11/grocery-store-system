# Grocery store system
### A complete management tool for grocery stores!

This system's goal is to help a manager of a grocery store to organize his/her stock efficiently without losing the count of the incoming and outgoing products. With that, the system should be able to:

* Register new products;
* Update the product's amount in stock based on each sell;
* Edit the product's sheet;
* A summary of the stock;
* Payment identification system;
* Administrative panel where the manager is able to check the stock's performace;

___
## 💻 Tech Stack 💻

In order to build this project, the following technologies were used:

* [Python](https://www.python.org/)
* [Django](https://www.djangoproject.com/)
* [Django Rest Framework](https://www.django-rest-framework.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [React.js](https://reactjs.org/)
* [Material-UI](https://mui.com/)

___
## 🏢 Business rules 🏢

- [x] When a sale is made on the sale screen, the product's table has to be updated in the 'amount_in_stock' field according to the amount of the products that were sold.
- [x] If a product's amount in stock is equal or less than 0 it can not be sold.
- [x] When a sale is made, the invoice table must be updated with the gross total, net total and tax total for each product sold. Each product has it's own taxes so the system should be able to see these taxes and calculate accordingly.
- [x] If a product is not active, it can not be sold.
- [x] On the sales table, the customer's name and customer's cpf are optional, because not everyone wants to share this information.

___
## 📺 Screens 📺

Accordingly to the propsed functionalities, the following screens should be implemented:

- [x] Login screen for the system manager. All the other screens/routes must have authentication rules with JWT
- [ ] Dashboard screen. This is the first screen that should be displayed right after a successfull login.
- [x] Register product screen
- [x] List products screen
- [x] Edit product screen
- [x] Delete product screen
- [ ] Sales consolidation screen

___
## 👾 Author 👾

Made with ❤ by [Firmino Neto](https://github.com/firminoneto11).
