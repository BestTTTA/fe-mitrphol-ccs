FROM python:3.11.5-slim

# Install Python packages
RUN pip install flask folium requests

# Copy your Python script
COPY . .

# Expose the port Flask is running on
EXPOSE 6666

# Run the Python script
CMD ["python", "app.py"]
