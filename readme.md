
# ByteBite 🍽️ - Scalable Restaurant Ordering Platform

ByteBite is a scalable, microservices-based food ordering platform designed for high performance, modularity, and reliability. It empowers restaurant owners to manage menus, process orders in real-time, and provides customers with a seamless, secure ordering experience.

The system follows a modern, event-driven architecture using Dockerized microservices and industry-standard technologies.

---

## 🚀 Tech Stack

**Frontend**  
- React.js *(Planned - Frontend development not included in this repository)*

**Backend Microservices**  
- Node.js  
- Express.js  
- MongoDB (Dedicated databases per service)  
- Redis (Session management, caching)  
- Apache Kafka (Event-driven communication)  

**Containerization & DevOps**  
- Docker  
- Docker Compose  
- Shared Docker Network for service isolation and communication  

---

## 🛠️ Getting Started

### Start All Services

```bash
docker-compose up --build
```

### Access Running Services

| Service              | URL                                |
|---------------------|-------------------------------------|
| Authentication      | http://localhost:5006               |
| Profile Service     | http://localhost:5001               |
| Order Service       | http://localhost:5002               |
| Restaurant Service  | http://localhost:5003               |
| Review Service      | http://localhost:5004               |
| Analytics Service   | http://localhost:5005               |
| Gateway             | http://localhost:3000               |
| MongoDB, Redis, Kafka | Managed within containers         |

### Development Workflow

- Live code updates using bind mounts in Docker  
- Each service has its own folder with source code and configuration  
- Kafka topics enable reliable event-driven operations between services  

---

## ⚙️ Project Structure

```
bytebite/
├── auth-service/         # Handles user registration, login, authentication
├── profile-service/      # Manages user profile creation and updates
├── order-service/        # Processes orders and tracks order status
├── restaurant-service/   # Manages restaurant related tasks
├── review-service/       # Handles item reviews
├── analytics-service/    # Provides all the restaurant and user analytics
├── gateway/              # Provides a common endpoint for connecting to all the services
├── docker-compose.yml    # Multi-service orchestration file
└── README.md              # Project overview and instructions
```

---

## 🧩 Planned Features

- Frontend application with React.js  
- Restaurant dashboard for managing orders  
- Payment service integration  
- Enhanced monitoring, logging, and system observability  

---

## 🧑‍💻 Contributing

Contributions are welcome!

1. Fork the repository  
2. Create a feature branch  
3. Submit a pull request  

For significant changes, please open an issue first to discuss the proposal.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🌐 Contact

For questions or collaboration:  
**Mayank Tiwari**  
[LinkedIn](https://www.linkedin.com/in/tiwari-mayank/)  
