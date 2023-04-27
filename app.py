from flask import Flask, request, Response
from flask_cors import CORS
import requests
import re
from bs4 import BeautifulSoup
import os

app = Flask(__name__, static_folder='my-app/build', static_url_path='/')
CORS(app)

# Serve the React UI
@app.route('/')
def index():
    return app.send_static_file('index.html')


# Scrape the URLs and return the results as a file
@app.route('/scrape', methods=['POST'])
def scrape():
    urls = request.json['urls']

    # Split the URLs by line and remove any leading/trailing whitespace
    urls = [url.strip() for url in urls.split('\n')]

    # Generate the text content
    content = ''
    for url in urls:
        try:
            response = requests.get(url)
            response.raise_for_status()
            html = response.text

            # Use BeautifulSoup to extract the text from all <p> tags inside the <body> tag
            soup = BeautifulSoup(html, 'html.parser')
            body = soup.find('p')
            p_tags = body.find_all('span')
            text = ''
            for p in p_tags:
                text += p.get_text() + '\n'

            content += format(url, text) + '\n\n' 
        except:
            pass

    # Generate the response as a file download
    if content:
        response = Response(content, mimetype='text/plain')
        response.headers.set('Content-Disposition', 'attachment', filename='scraped_content.txt')
        return response
    else:
        return 'No content could be scraped from the provided URLs.'


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)