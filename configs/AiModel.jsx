const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require  ("@google/generative-ai");


const apiKey= process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const GenerateCourseLayout_AI = model.startChat({
  generationConfig,
  history: [
    { 
      role: "user",
      parts: [
        {
          text: "Generate a course tutorial on following details with field name, description, along with the chapter name about and duration: Category 'programming' Topic 'python' Level 'basic' Duration '1 hour' chapters '5' in JSON format.\n",
        },
      ],
    },
    {
      role: "model",
      parts: [
        {
          text: '```json\n{\n  "category": "programming",\n  "topic": "python",\n   "description": "Python is a high-level, general-purpose programming language known for its simplicity, readability, and versatility. Its widely used for web development, data analysis, machine learning, and automation tasks.",\n "level": "basic",\n  "duration": "1 hour",\n  "chapters": [\n    {\n      "chapter_name": "Introduction to Python",\n      "description": "This chapter covers the basics of Python programming, including data types, variables, operators, and control flow.",\n      "duration": "15 minutes"\n    },\n    {\n      "chapter_name": "Working with Data Structures",\n      "description": "This chapter explores fundamental data structures like lists, tuples, dictionaries, and sets.",\n      "duration": "20 minutes"\n    },\n    {\n      "chapter_name": "Functions and Modules",\n      "description": "This chapter teaches how to define and use functions, as well as import and utilize modules.",\n      "duration": "15 minutes"\n    },\n    {\n      "chapter_name": "Loops and Iteration",\n      "description": "This chapter focuses on different looping mechanisms like \'for\' and \'while\' loops to iterate over data.",\n      "duration": "10 minutes"\n    },\n    {\n      "chapter_name": "Basic Input and Output",\n      "description": "This chapter covers how to take user input and display output using Python.",\n      "duration": "10 minutes"\n    }\n  ]\n}\n```\n',
        },
      ],
    },
  ],
});

export const GenerateChapterContent_AI = model.startChat({
  generationConfig,
  history: [
    {
      role: "user",
      parts: [
        {text: "Explain the concept in Detail on Topic: Springboot, Chapter: Advanced REST Controllers, in JSON Format with list of array with field as title, explanation on given chapter in detail, Code Example(Code field in <precode> format) if applicable."},
      ],
    },
    {
      role: "model",
      parts: [
        {text: "```json\n{\n  \"title\": \"Advanced Spring Boot REST Controllers\",\n  \"chapters\": [\n    {\n      \"title\": \"Handling Exceptions\",\n      \"explanation\": \"Proper exception handling is crucial for building robust REST APIs.  Spring Boot provides several mechanisms to manage exceptions gracefully and return meaningful responses to clients.  This involves using `@ControllerAdvice` to globally handle exceptions, creating custom exception classes for specific API errors, and using `@ExceptionHandler` methods to map exceptions to HTTP status codes and JSON responses.  This ensures that clients receive informative error messages instead of generic server errors.\",\n      \"codeExample\": \"<precode>\\n@ControllerAdvice\\npublic class GlobalExceptionHandler {\\n\\n    @ExceptionHandler(ResourceNotFoundException.class)\\n    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex, WebRequest request) {\\n        ErrorResponse errorResponse = new ErrorResponse(HttpStatus.NOT_FOUND.value(), ex.getMessage(), request.getDescription(false));\\n        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);\\n    }\\n\\n    // ... other exception handlers\\n}\\n\\nclass ErrorResponse {\\n    private int status;\\n    private String message;\\n    private String description;\\n    // ... constructor, getters and setters\\n}\\n\\nclass ResourceNotFoundException extends RuntimeException {\\n    // ... constructor\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Input Validation\",\n      \"explanation\": \"Validating input data is essential for preventing invalid data from entering your application.  Spring Boot leverages Bean Validation (using annotations like `@NotNull`, `@Size`, `@Pattern`, etc.) to validate request bodies.  The framework automatically handles validation failures and returns appropriate HTTP error responses (usually 400 Bad Request).  You can customize the error messages and improve the user experience by creating custom validation annotations and messages.\",\n      \"codeExample\": \"<precode>\\n@PostMapping\\npublic ResponseEntity<User> createUser(@Valid @RequestBody User user) {\\n    // ... save user\\n}\\n\\nclass User {\\n    @NotNull\\n    @Size(min = 2, max = 25)\\n    private String name;\\n    // ... other fields\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Using Different HTTP Methods Effectively\",\n      \"explanation\": \"RESTful APIs use different HTTP methods (GET, POST, PUT, DELETE, PATCH) to perform different actions.  Choosing the correct method ensures proper API semantics and maintainability.  Understanding the nuances of each method and using them appropriately is key for designing well-structured APIs.  For example, `GET` is for retrieving resources, `POST` for creating, `PUT` for updating the entire resource, `PATCH` for partial updates, and `DELETE` for removing resources.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(\\\"/users/{id}\\\")\\npublic ResponseEntity<User> getUser(@PathVariable Long id) {\\n    // ...\\n}\\n\\n@PostMapping(\\\"/users\\\")\\npublic ResponseEntity<User> createUser(@RequestBody User user) {\\n    // ...\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Implementing HATEOAS (Hypermedia as the Engine of Application State)\",\n      \"explanation\": \"HATEOAS is a REST architectural constraint where the API responses include links to related resources.  This allows clients to navigate the API dynamically without hardcoding URLs, making the API more flexible and discoverable.  Spring HATEOAS provides support for creating HATEOAS-compliant responses.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(\\\"/users/{id}\\\")\\npublic EntityModel<User> getUser(@PathVariable Long id) {\\n    User user = userRepository.findById(id).orElseThrow(ResourceNotFoundException::new);\\n    return EntityModel.of(user, linkTo(methodOn(UserController.class).getUser(id)).withSelfRel());\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Content Negotiation\",\n      \"explanation\": \"Content negotiation allows clients to specify the desired format of the response (e.g., JSON, XML).  Spring Boot automatically handles content negotiation based on the `Accept` header in the request.  You can customize this behavior using `@RequestMapping` with `produces` attribute to specify the supported media types.\",\n      \"codeExample\": \"<precode>\\n@GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)\\npublic ResponseEntity<List<User>> getAllUsers() {\\n    // ...\\n}\\n</precode>\"\n    },\n    {\n      \"title\": \"Asynchronous REST Controllers with CompletableFuture\",\n      \"explanation\": \"To avoid blocking threads while waiting for long-running operations (like database queries or external API calls), use asynchronous processing with `CompletableFuture`. This improves API responsiveness and scalability.  Spring supports returning `CompletableFuture` from controller methods.\",\n      \"codeExample\": \"<precode>\\n@GetMapping\\npublic CompletableFuture<List<User>> getAllUsers() {\\n    return CompletableFuture.supplyAsync(() -> userRepository.findAll());\\n}\\n</precode>\"\n    }\n  ]\n}\n```\n"},
      ],
    },
  ],
});

