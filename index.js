/* Author: Vincent Eurasto */

//Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const fetch = require('node-fetch');
const path = require('path');

//Use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*
Get countries and their data based on iso codes.
Fetches data straight from WorldBank API.
*/
app.get('/api/countries', (req, res) => {
    const id = Object.values(req.query);
    if (id) {

        //Emission data
        const getPopulationData = fetch("https://api.worldbank.org/v2/country/" + id + "/indicator/SP.POP.TOTL?per_page=20000&format=json")
            .then(res => res.json())
            .catch(function(error) {
                console.log(error);
            });

        //Population data
        const getEmissionData = fetch("https://api.worldbank.org/v2/country/" + id + "/indicator/EN.ATM.CO2E.KT?per_page=20000&format=json")
            .then(res => res.json())
            .catch(function(error) {
                console.log(error);
            });

        Promise.all([getPopulationData, getEmissionData])
            .then(data => {
                let populations = data[0][1]
                let emissions = data[1][1]
                response = {}

                if (populations !== null && emissions !== null) {
                    let years = populations.length > emissions.length ? populations.map(element => element.date) : emissions.map(element => element.date)

                    response = {
                        name : populations[0].country.value,
                        id : id,
                        data : []
                    }
        
                    years.forEach((year, index) => {
                        response.data.push({
                            year : year,
                            emission : index > (emissions.length - 1) ? null : emissions[index].value,
                            population : index > (populations.length - 1) ? null : populations[index].value,
                            per_capita : index > (populations.length - 1) || index > (emissions.length - 1) || emissions[index].value === null ? null : (emissions[index].value / populations[index].value)
                        });
                    });
                    res.send(response);
                } else {
                    res.send({"error" : "Could not fetch data for country ID : " + id})
                }
        });
    }
});

//Fetches country names and their isocodes for the client (navigation bar)
app.get('/api/countries/names', (req, res) => {
    fetch("https://api.worldbank.org/v2/countries?format=json&per_page=4000")
        .then(res => res.json())
        .then(
        (result) => {
            const initialCountryData = result[1].map((element) =>{
                return {
                    name : element.name,
                    iso2Code: element.iso2Code
                }
            });
            res.json(initialCountryData)
        },
        (error) => {
            res.json(error)
        }
    )
});

if (process.env.NODE_ENV === 'production') {
    
    //static files
    app.use(express.static(path.join(__dirname, 'Client/build')));

    //needed for React
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'Client/build', 'index.html'));
    });
  }

app.listen(port, () => console.log(`Listening on port ${port}`));