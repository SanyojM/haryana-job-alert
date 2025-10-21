# API Documentation

This document provides a complete reference for all the APIs available in the backend application.

---

## 🏠 App API

Handles the root endpoint of the application.

### Get Hello

-   **Route:** `GET /`
-   **Description:** A simple health check or welcome endpoint.
-   **Request Body:** None
-   **Returns:** A "Hello World!" string.

---

## 🔐 Auth API

Handles user authentication, including signup, login, and profile management.

### User Signup

-   **Route:** `POST /auth/signup`
-   **Description:** Registers a new user with the `student` role by default.
-   **Request Body:**
    ```json
    {
      "full_name": "string",
      "email": "string (valid email)",
      "password": "string (min 8 characters)"
    }
    ```
-   **Returns:** The newly created User object (without the password hash).

### User Login

-   **Route:** `POST /auth/login`
-   **Description:** Authenticates a user and returns a JSON Web Token (JWT).
-   **Request Body:**
    ```json
    {
      "email": "string (valid email)",
      "password": "string"
    }
    ```
-   **Returns:** An object containing the `access_token`.
    ```json
    {
      "access_token": "string"
    }
    ```

### Get User Profile

-   **Route:** `GET /auth/profile`
-   **Authentication:** **JWT Required**. The `access_token` must be provided in the `Authorization` header as a Bearer token.
-   **Description:** Retrieves the profile of the currently authenticated user, including their mock test attempts.
-   **Request Body:** None
-   **Returns:** The authenticated User object (without the password hash).

### Update User Profile

-   **Route:** `PUT /auth/profile`
-   **Authentication:** **JWT Required**. The `access_token` must be provided in the `Authorization` header as a Bearer token.
-   **Description:** Updates the profile information of the currently authenticated user. Only the provided fields will be updated.
-   **Request Body:**
    ```json
    {
      "full_name": "string (optional, min 2 characters)",
      "email": "string (optional, valid email)"
    }
    ```
-   **Returns:** The updated User object (without the password hash).
-   **Notes:** 
    - If updating email, the new email must not be already taken by another user.
    - Both fields are optional - you can update one or both.

---

## 📝 Posts API

Handles all operations related to blog posts.

### Create a new post

-   **Route:** `POST /posts`
-   **Description:** Creates a new post. If a thumbnail is included, it's uploaded automatically.
-   **Request Body:** `multipart/form-data`. This request combines the image file and all other post data.
    -   **file** (file, optional): The thumbnail image file.
    -   **title** (string): The title of the post.
    -   **slug** (string): The unique slug for the URL.
    -   **category\_id** (number): The ID of the category.
    -   **template\_id** (number): The ID of the post template.
    -   **content\_html** (string): The final HTML content of the post.
    -   **content\_json** (string, optional): A JSON string representing the structured content (e.g., `'{"key":"value"}'`).
    -   **tags** (string, optional): A comma-separated string of tag IDs (e.g., `"1,2,3"`).
    -   **description** (string, optional)
    -   **meta\_title** (string, optional)
    -   **meta\_description** (string, optional)
    -   **meta\_keywords** (string, optional)
-   **Returns:** The newly created Post object, including the `thumbnail_url` if a file was uploaded.

### Get all posts

-   **Route:** `GET /posts`
-   **Description:** Retrieves a list of all posts, ordered by creation date.
-   **Request Body:** None
-   **Returns:** An array of Post objects.

### Get a single post by ID

-   **Route:** `GET /posts/:id`
-   **Description:** Retrieves a specific post using its numerical ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the post.
-   **Request Body:** None
-   **Returns:** A single Post object.

### Get a single post by Slug

-   **Route:** `GET /posts/slug/:slug`
-   **Description:** Retrieves a specific post using its unique string slug.
-   **URL Parameters:**
    -   `slug` (string): The slug of the post.
-   **Request Body:** None
-   **Returns:** A single Post object.

### Update a post

-   **Route:** `PUT /posts/:id`
-   **Description:** Updates an existing post's details.
-   **URL Parameters:**
    -   `id` (number): The ID of the post to update.
-   **Request Body:** Same structure as the create request, but all fields are optional.
-   **Returns:** The updated Post object.

### Delete a post

-   **Route:** `DELETE /posts/:id`
-   **Description:** Deletes a post from the database.
-   **URL Parameters:**
    -   `id` (number): The ID of the post to delete.
-   **Request Body:** None
-   **Returns:** The deleted Post object.

---

## 📂 Categories API (for Posts)

Handles categories associated with blog posts.

### Create a new category

-   **Route:** `POST /categories`
-   **Description:** Creates a new post category.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The newly created Category object.

### Get all categories

-   **Route:** `GET /categories`
-   **Description:** Retrieves a list of all post categories.
-   **Request Body:** None
-   **Returns:** An array of Category objects.

### Get a single category by ID

-   **Route:** `GET /categories/:id`
-   **Description:** Retrieves a specific category by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the category.
-   **Request Body:** None
-   **Returns:** A single Category object.

### Update a category

-   **Route:** `PUT /categories/:id`
-   **Description:** Updates an existing category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to update.
-   **Request Body:**
    ```json
    {
      "name": "string (optional)",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The updated Category object.

### Delete a category

-   **Route:** `DELETE /categories/:id`
-   **Description:** Deletes a category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to delete.
-   **Request Body:** None
-   **Returns:** The deleted Category object.

---

## 🏷️ Tags API (for Posts)

Handles tags associated with blog posts.

### Create a new tag

-   **Route:** `POST /tags`
-   **Description:** Creates a new post tag.
-   **Request Body:**
    ```json
    {
      "name": "string"
    }
    ```
-   **Returns:** The newly created Tag object.

### Get all tags

-   **Route:** `GET /tags`
-   **Description:** Retrieves a list of all post tags.
-   **Request Body:** None
-   **Returns:** An array of Tag objects.

### Get a single tag by ID

-   **Route:** `GET /tags/:id`
-   **Description:** Retrieves a specific tag by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag.
-   **Request Body:** None
-   **Returns:** A single Tag object.

### Update a tag

-   **Route:** `PUT /tags/:id`
-   **Description:** Updates an existing tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to update.
-   **Request Body:**
    ```json
    {
      "name": "string (optional)"
    }
    ```
-   **Returns:** The updated Tag object.

### Delete a tag

-   **Route:** `DELETE /tags/:id`
-   **Description:** Deletes a tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to delete.
-   **Request Body:** None
-   **Returns:** The deleted Tag object.

---

## 📄 Post Templates API

Handles templates for structuring post content.

### Create a new post template

-   **Route:** `POST /post-templates`
-   **Description:** Creates a new post template.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)",
      "structure": "string"
    }
    ```
-   **Returns:** The newly created Post Template object.

### Get all post templates

-   **Route:** `GET /post-templates`
-   **Description:** Retrieves a list of all post templates.
-   **Request Body:** None
-   **Returns:** An array of Post Template objects.

### Get a single post template by ID

-   **Route:** `GET /post-templates/:id`
-   **Description:** Retrieves a specific post template by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the template.
-   **Request Body:** None
-   **Returns:** A single Post Template object.

### Update a post template

-   **Route:** `PUT /post-templates/:id`
-   **Description:** Updates an existing post template.
-   **URL Parameters:**
    -   `id` (number): The ID of the template to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Post Template object.

### Delete a post template

-   **Route:** `DELETE /post-templates/:id`
-   **Description:** Deletes a post template.
-   **URL Parameters:**
    -   `id` (number): The ID of the template to delete.
-   **Request Body:** None
-   **Returns:** The deleted Post Template object.

---

## 🧪 Mock Tests & Series API

Handles mock tests, the series they belong to, and related entities.

### Get all mock test series

-   **Route:** `GET /mock-series`
-   **Description:** Retrieves a list of all mock test series.
-   **Request Body:** None
-   **Returns:** An array of Mock Series objects.

### Get a single mock series by Slugs

-   **Route:** `GET /mock-series/slug/:categorySlug/:seriesSlug`
-   **Description:** Retrieves a specific mock series using the category's slug and the series's own slug.
-   **URL Parameters:**
    -   `categorySlug` (string): The slug of the category.
    -   `seriesSlug` (string): The slug of the series.
-   **Request Body:** None
-   **Returns:** A single Mock Series object, including its associated tests.

### Create a new mock test series

-   **Route:** `POST /mock-series`
-   **Description:** Creates a new series to group mock tests. If a thumbnail is included, it's uploaded automatically.
-   **Request Body:** `multipart/form-data`. This request combines the image file and all other series data.
    -   **file** (file, optional): The thumbnail image file.
    -   **title** (string): The title of the series.
    -   **description** (string, optional)
    -   **price** (number): The price of the series.
    -   **category\_id** (number): The ID of the mock category.
    -   **tagIds** (string, optional): A comma-separated string of tag IDs (e.g., `"1,2,3"`).
-   **Returns:** The newly created Mock Series object, including the `thumbnail_url` if a file was uploaded.

### Get a single mock series by ID

-   **Route:** `GET /mock-series/:id`
-   **Description:** Retrieves a specific mock series and its associated tests.
-   **URL Parameters:**
    -   `id` (number): The ID of the series.
-   **Request Body:** None
-   **Returns:** A single Mock Series object.

### Update a mock series

-   **Route:** `PUT /mock-series/:id`
-   **Description:** Updates an existing mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Series object.

### Delete a mock series

-   **Route:** `DELETE /mock-series/:id`
-   **Description:** Deletes a mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Series object.

### Add a test to a series

-   **Route:** `POST /mock-series/:seriesId/tests/:testId`
-   **Description:** Associates an existing mock test with a mock series and generates the full slug.
-   **URL Parameters:**
    -   `seriesId` (number): The ID of the series.
    -   `testId` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** A `mock_series_tests` join table record.

### Remove a test from a series

-   **Route:** `DELETE /mock-series/:seriesId/tests/:testId`
-   **Description:** Removes the association between a test and a series.
-   **URL Parameters:**
    -   `seriesId` (number): The ID of the series.
    -   `testId` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** The deleted `mock_series_tests` join table record.

### Check enrollment status for a series

-   **Route:** `GET /mock-series/:id/check-enrollment`
-   **Authentication:** **JWT Required**.
-   **Description:** Checks if the authenticated user has successfully paid for and is enrolled in a mock series.
-   **URL Parameters:**
    -   `id` (number): The ID of the series.
-   **Request Body:** None
-   **Returns:** An object indicating enrollment status.
    ```json
    {
      "enrolled": "boolean"
    }
    ```

---

## 📜 Mock Tests API

### Get all mock tests

-   **Route:** `GET /mock-tests`
-   **Description:** Retrieves a list of all available mock tests.
-   **Request Body:** None
-   **Returns:** An array of Mock Test objects.

### Create a new mock test

-   **Route:** `POST /mock-tests`
-   **Description:** Creates a new standalone mock test.
-   **Request Body:**
    ```json
    {
      "title": "string",
      "description": "string (optional)",
      "duration_minutes": "number",
      "total_marks": "number",
      "is_free": "boolean (optional)"
    }
    ```
-   **Returns:** The newly created Mock Test object.

### Get a single mock test by ID

-   **Route:** `GET /mock-tests/:id`
-   **Description:** Retrieves a specific mock test and its questions by its ID.
-   **URL Parameters:**
    -   `id` (number): The ID of the test.
-   **Request Body:** None
-   **Returns:** A single Mock Test object.

### Get a single mock test by full slug

-   **Route:** `GET /mock-tests/:categorySlug/:seriesSlug/:testSlug`
-   **Description:** Retrieves a specific mock test using its full, generated slug.
-   **URL Parameters:**
    -   `categorySlug` (string): The slug of the category.
    -   `seriesSlug` (string): The slug of the series.
    -   `testSlug` (string): The slug of the test.
-   **Request Body:** None
-   **Returns:** The `mock_series_tests` object containing the full test details.

### Update a mock test

-   **Route:** `PUT /mock-tests/:id`
-   **Description:** Updates an existing mock test.
-   **URL Parameters:**
    -   `id` (number): The ID of the test to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Test object.

### Delete a mock test

-   **Route:** `DELETE /mock-tests/:id`
-   **Description:** Deletes a mock test.
-   **URL Parameters:**
    -   `id` (number): The ID of the test to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Test object.

### Submit answers for a mock test

-   **Route:** `POST /mock-tests/:id/submit`
-   **Authentication:** **JWT Required**.
-   **Description:** Submits a user's answers for a mock test, calculates the score, and records the attempt.
-   **URL Parameters:**
    -   `id` (number): The ID of the test being submitted.
-   **Request Body:**
    ```json
    {
      "answers": {
        "questionId_1": "user_answer_1",
        "questionId_2": "user_answer_2"
      }
    }
    ```
-   **Returns:** The created Mock Attempt object with the final score.

### Get a single mock test attempt result

-   **Route:** `GET /mock-tests/attempts/:id`
-   **Authentication:** **JWT Required**.
-   **Description:** Retrieves detailed information about a specific mock test attempt, including all questions, correct answers, and user's answers. Users can only access their own attempts.
-   **URL Parameters:**
    -   `id` (number): The ID of the attempt.
-   **Request Body:** None
-   **Returns:** A Mock Attempt object with detailed information:
    ```json
    {
      "id": "string",
      "test_id": "string",
      "user_id": "string",
      "answers": {
        "questionId": "user_answer"
      },
      "score": "number",
      "started_at": "string (ISO date)",
      "completed_at": "string (ISO date)",
      "mock_tests": {
        "id": "string",
        "title": "string",
        "description": "string",
        "duration_minutes": "number",
        "total_marks": "number",
        "mock_questions": [
          {
            "id": "string",
            "question_text": "string",
            "question_type": "string",
            "options": {},
            "correct_answer": "string",
            "marks": "number"
          }
        ]
      },
      "users": {
        "id": "string",
        "full_name": "string",
        "email": "string"
      }
    }
    ```

---

## ❓ Mock Questions API

### Create a new mock question

-   **Route:** `POST /mock-questions`
-   **Description:** Adds a new question to a mock test.
-   **Request Body:**
    ```json
    {
      "test_id": "number",
      "question_text": "string",
      "question_type": "string ('mcq', 'true_false', 'fill_blank') (optional)",
      "options": {},
      "correct_answer": "string",
      "marks": "number (optional)"
    }
    ```
-   **Returns:** The newly created Mock Question object.

### Bulk upload questions via CSV

-   **Route:** `POST /mock-questions/upload/csv`
-   **Description:** Uploads a CSV file to create multiple questions for a specific test in one go.
-   **Request Body:** `multipart/form-data` with two fields:
    -   `file`: The CSV file.
    -   `test_id`: The ID of the mock test.
-   **Returns:** A confirmation message with the count of created questions.

### Get all mock questions

-   **Route:** `GET /mock-questions`
-   **Description:** Retrieves a list of all mock questions.
-   **Request Body:** None
-   **Returns:** An array of Mock Question objects.

### Get a single mock question by ID

-   **Route:** `GET /mock-questions/:id`
-   **Description:** Retrieves a specific mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question.
-   **Request Body:** None
-   **Returns:** A single Mock Question object.

### Update a mock question

-   **Route:** `PUT /mock-questions/:id`
-   **Description:** Updates an existing mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Question object.

### Delete a mock question

-   **Route:** `DELETE /mock-questions/:id`
-   **Description:** Deletes a mock question.
-   **URL Parameters:**
    -   `id` (number): The ID of the question to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Question object.

---

## 📂 Mock Categories API (for Series)

### Create a new mock category

-   **Route:** `POST /mock-categories`
-   **Authentication:** **JWT Required** with **`admin`** role.
-   **Description:** Creates a new category for mock test series.
-   **Request Body:**
    ```json
    {
      "name": "string",
      "description": "string (optional)"
    }
    ```
-   **Returns:** The newly created Mock Category object.

### Get all mock categories

-   **Route:** `GET /mock-categories`
-   **Description:** Retrieves a list of all mock series categories.
-   **Request Body:** None
-   **Returns:** An array of Mock Category objects.

### Get a single mock category by ID

-   **Route:** `GET /mock-categories/:id`
-   **Description:** Retrieves a specific mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category.
-   **Request Body:** None
-   **Returns:** A single Mock Category object.

### Update a mock category

-   **Route:** `PUT /mock-categories/:id`
-   **Description:** Updates an existing mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to update.
-   **Request Body:** Same as create, but all fields are optional.
-   **Returns:** The updated Mock Category object.

### Delete a mock category

-   **Route:** `DELETE /mock-categories/:id`
-   **Description:** Deletes a mock category.
-   **URL Parameters:**
    -   `id` (number): The ID of the category to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Category object.

---

## 🏷️ Mock Tags API (for Series)

### Create a new mock tag

-   **Route:** `POST /mock-tags`
-   **Description:** Creates a new tag for mock test series.
-   **Request Body:**
    ```json
    {
      "name": "string"
    }
    ```
-   **Returns:** The newly created Mock Tag object.

### Get all mock tags

-   **Route:** `GET /mock-tags`
-   **Description:** Retrieves a list of all mock series tags.
-   **Request Body:** None
-   **Returns:** An array of Mock Tag objects.

### Get a single mock tag by ID

-   **Route:** `GET /mock-tags/:id`
-   **Description:** Retrieves a specific mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag.
-   **Request Body:** None
-   **Returns:** A single Mock Tag object.

### Update a mock tag

-   **Route:** `PUT /mock-tags/:id`
-   **Description:** Updates an existing mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to update.
-   **Request Body:** Same as create, but `name` is optional.
-   **Returns:** The updated Mock Tag object.

### Delete a mock tag

-   **Route:** `DELETE /mock-tags/:id`
-   **Description:** Deletes a mock tag.
-   **URL Parameters:**
    -   `id` (number): The ID of the tag to delete.
-   **Request Body:** None
-   **Returns:** The deleted Mock Tag object.

---

## 💰 Payments API

Handles payment processing via Razorpay.

### Create a payment order

-   **Route:** `POST /payments/create-order`
-   **Authentication:** **JWT Required**.
-   **Description:** Creates a Razorpay order for purchasing a mock series.
-   **Request Body:**
    ```json
    {
      "mock_series_id": "number"
    }
    ```
-   **Returns:** An object with order details for the frontend client.
    ```json
    {
        "order_id": "string",
        "amount": "number",
        "currency": "string",
        "series_title": "string"
    }
    ```

### Handle Razorpay Webhook

-   **Route:** `POST /payments/webhook/razorpay`
-   **Description:** An endpoint for Razorpay to send payment confirmation webhooks. It verifies the signature and updates the payment status in the database.
-   **Headers:**
    -   `x-razorpay-signature`: The signature provided by Razorpay for verification.
-   **Request Body:** The raw JSON payload sent by Razorpay.
-   **Returns:** A confirmation status.

---

## 🚀 Deployment API

Provides a secure, web-based interface to deploy application updates.

### Get the deployment page

-   **Route:** `GET /deployment`
-   **Description:** Returns an HTML page with a form to trigger a deployment.
-   **Request Body:** None
-   **Returns:** An HTML document.

### Trigger deployment

-   **Route:** `POST /deployment/deploy`
-   **Description:** Executes the deployment script (`git pull`, `npm run build`, `pm2 restart`) if the correct secret key is provided.
-   **Request Body:**
    ```json
    {
      "secretKey": "string"
    }
    ```
-   **Returns:** An object with the success status and the output from each command.

---

## 🎓 Courses API

This module is currently a placeholder.

-   **Route:** `/courses`
-   **Description:** No routes are currently defined for this module.