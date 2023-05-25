from flask import Flask, request, Response
from flask import send_file
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import os
from io import BytesIO
from zipfile import ZipFile

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
    print(urls)
    # Generate the text content
    stream = BytesIO()
    print('Create stream')
    with ZipFile(stream,'w') as zf:
        for index, url in enumerate(urls):
            print('Start scraping file '+ str(index))
            try:
                content = ''
                response = requests.get(url)
                soup = BeautifulSoup(response.content,'html.parser')
                p_tags = soup.find_all(['p','h1','h2','h3','h4','h5','h6','li'])
                for p in p_tags:
                    content += p.get_text() + '\n'
                if content:
                    print('Add file')
                    zf.writestr('scrapped_file_'+str(index)+'.txt',content)
            except:
                pass
        zf.printdir()
    stream.seek(0)
    print('Return zip file')

    # response = Response('testing', mimetype='text/plain')
    # response.headers.set('Content-Disposition', 'attachment', filename='archive.zip')
    # return response
    return send_file(
        stream,
        as_attachment=True,
        download_name='archive.zip'
    )



if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port,debug=True)