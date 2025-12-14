# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy source code first
COPY . .

# Tidy dependencies to generate go.sum
RUN go mod tidy

# Download dependencies
RUN go mod download && go mod verify

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/server ./cmd/server

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/server .

EXPOSE 8080

CMD ["./server"]
