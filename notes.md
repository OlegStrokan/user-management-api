Notes

In the example provided in the technical specification, I guess there is an error:
GET /users/managed/5  

# RETURNS  
[  
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },  
  { id: 2, name: "Gabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] }  
]  
Here, we should receive 3 items, including the user with id = 6, since their groups attribute contains GROUP_1.
The technical specification does not specify requirements for our data storage. I chose not to store data in a file to make my code closer to production-ready. Instead, we persist the data in PostgreSQL.

for simplicity, I created only a single User entity, though in a real-world scenario, we would likely need relationships between User, Roles, Groups, and Permissions.

the core functionality is covered by tests that work with real data and an actual database.

additionally, to make the code more production-like, I used GitHub Actions CI that tests the project across different jobs.

the project can be tried in three ways:

Local setup
Docker
A deployed version (more details in README.md)
for convenience, I added Swagger documentation so testing doesn’t require Postman. I’ll attach a video demonstrating this in the email.

for correctness, I used the ULID type for user IDs when creating new users. However, for ease of use, my predefined users retain the same IDs you provided in the task.

let me know if i missed something. Thanks