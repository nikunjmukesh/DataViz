import json
from bson import json_util
from bson.json_util import dumps
from pymongo import MongoClient
from flask import Flask
from flask import render_template

app = Flask(__name__)


MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'massmurders'
COLLECTION_NAME = 'projects'

# FIELDS = {'school_state': True, 'resource_type': True, 'poverty_level': True, 'date_posted': True, 'total_donations': True, '_id': False}

FIELDS = {'state': True, 'deaths': True, 'victims': True, 'race': True, 'shooter_fate': True, 'motive':True, 'date': True, '_id': False}



connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
collection = connection[DBS_NAME][COLLECTION_NAME]
projects = collection.find(projection=FIELDS)

@app.route("/")
def main():
    return render_template("main.html")


# @app.route("/donorschoose/projects")
# def donorschoose_projects():
#     connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
#     collection = connection[DBS_NAME][COLLECTION_NAME]
#     projects = collection.find(projection=FIELDS)
#     json_projects = []
#     for project in projects:
#         json_projects.append(project)
#     json_projects = json.dumps(json_projects, default=json_util.default)
#     connection.close()
#     return json_projects

@app.route("/massmurders/projects")
def massmurders_projects():
    connection = MongoClient(MONGODB_HOST, MONGODB_PORT)
    collection = connection[DBS_NAME][COLLECTION_NAME]
    projects = collection.find(projection=FIELDS)
    json_projects = []
    for project in projects:
     json_projects.append(project)
    json_projects = json.dumps(json_projects, default=json_util.default)
    connection.close()
    return json_projects


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)

