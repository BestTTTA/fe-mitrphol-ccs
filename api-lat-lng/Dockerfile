# Use an official Python runtime as the parent image
FROM python:3.11.5

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the contents of the invertor-agents folder into the container
COPY . .

RUN pip install fastapi uvicorn scikit-learn==1.1.3 pandas==1.5.3 xgboost
RUN  pip install --upgrade pip

EXPOSE 6060

# Run the script when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "6060", "--reload"]