Data Visualization of US Mass Shooting incidents
================================================
![Alt text]( https://raw.githubusercontent.com/nikunjmukesh/DataViz/master/USMassShooterDataVisualization/sampleDashboard.png?raw=true "Dashboard")
Requirements
============
 - Python 2.7+
 - PyMongo
 - Flask
 - MongoDB
 - "Mass Shootings in America" Standford Database

Steps to run visualizations project
===================================


*1. Clone this repository* 

```https://github.com/nikunjmukesh/DataViz.git ```

*2. Import "Mass shootings in America" dataset to Mongodb server*

```mongoimport -d masssmurders -c projects --type csv --file <database.csv> --headerline```

```Note: If you change the DB name or the collection name, change it accordingly in the 'server.py' and 'graphs.js'.```


*3. run "server.py"*
		
```python server.py```

*4. Open Localhost with port number 5000 in the browser*

		

