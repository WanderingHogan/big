# BIG Code Challenge

### API Calls

**Get All Reviews**
----
  Returns json data will all review data (since it is a small dataset anyways)

* **URL**

  /api/getAllReviews

* **Method:**

  `GET`
  
*  **URL Params**

  None
 

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ Status : Success, data : <data object> }`
 
* **Error Response:**

  * **Code:** 500<br />
    **Content:** `{ status: 'server error occurred' }`

* **No Data:**

  * **Code:** 200 <br />
    **Content:** `{status: 'No Data Found'}`



**Get Categories**
----
  Returns json data with distinct categories, sub categories, and count

* **URL**

  /api/getCategories

* **Method:**

  `GET`
  
*  **URL Params**

  None
 

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ Status : Success, data : <data object> }`
 
* **Error Response:**

  * **Code:** 500<br />
    **Content:** `{ status: 'server error occurred' }`

* **No Data:**

  * **Code:** 200 <br />
    **Content:** `{status: 'No Data Found'}`

