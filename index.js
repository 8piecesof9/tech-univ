import express from 'express';
import axios from 'axios';
import { DataFrame } from 'danfojs-node'

const app = express();
const PORT = process.env.PORT || 3000;

// Example route to fetch data from an API
app.get('/fetch-data', async (req, res) => {
  try {
    // Make a GET request to an external API
    const response = await axios.get('http://universities.hipolabs.com/search?country=United+States');
    // Fetch the response data
    var result = response.data
    // process the data 
    // make multiple data for single key into 1 

    const processedData = result.map(item=>{

        return {
            'Alpha Code':item['alpha_two_code'],
            'Domains':item.domains.join(" | "),
            'States':item['state-province'],
            'Country':item['country'],
            // Check if 'name' is not null or undefined before replacing commas
                // Replace commas with colons in the 'name' field
            'Name': item['name']? item['name'].replace(/,/g, ":") : '',
            'Web Pages':item.web_pages.join(" | ")
        }
    })

    var df = new DataFrame(processedData)

    df.toCSV({filePath:"Downloads/result.csv",index:false,header:true})
    res.send(df)


  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch data',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



