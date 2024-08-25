import dash
from dash import dcc, html
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import plotly.express as px

# Load environment variables from .env file
load_dotenv()

# Get the database connection details from environment variables
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')
DB_USER = os.getenv('DB_USER')
DB_PASSWORD = os.getenv('DB_PASSWORD')

# Database connection using SQLAlchemy
engine = create_engine(f'postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}')

# Main query to retrieve only necessary data from fact_entry and dim_calendar tables
query = """
SELECT fe.entry_date, dc.year_number
FROM fact_entry fe
JOIN dim_calendar dc ON fe.entry_date = dc.date_cal;
"""

# Read the data into a pandas DataFrame
df = pd.read_sql(query, engine)

# Print year distribution
print(df['year_number'].value_counts())

# Group data by year and count entries
yearly_data = df.groupby('year_number').size().reset_index(name='entries')

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout of the app
app.layout = html.Div(children=[
    html.H1(children='Fact Entry Dashboard'),

    dcc.Graph(
        id='barplot',
        figure=px.bar(yearly_data, x='year_number', y='entries', labels={'year_number': 'Year', 'entries': 'Number of Entries'})
    )
])

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)