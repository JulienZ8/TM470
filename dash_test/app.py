import dash
from dash import dcc, html, dash_table
import pandas as pd
from sqlalchemy import create_engine
from dotenv import load_dotenv
import os

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

# Query to retrieve data from dim_calendar table
query = """
SELECT
    date_cal_id,
    date_cal,
    year_number,
    month_number,
    month_name,
    month_name_short,
    month_year_name,
    month_year_number,
    week_number,
    week_number_year,
    week_day,
    week_name,
    week_day_name,
    week_day_name_short,
    quarter_number,
    period_customer,
    period_default,
    period_default_order,
    season_name,
    season,
    season_number,
    day
FROM public.dim_calendar;
"""

# Read the data into a pandas DataFrame
df = pd.read_sql(query, engine)

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout of the app
app.layout = html.Div(children=[
    html.H1(children='Dim Calendar Dashboard'),

    dash_table.DataTable(
        id='table',
        columns=[{"name": i, "id": i} for i in df.columns],
        data=df.to_dict('records'),
        page_size=10,
        style_table={'overflowX': 'auto'},
        style_cell={
            'height': 'auto',
            'minWidth': '100px', 'width': '100px', 'maxWidth': '100px',
            'whiteSpace': 'normal'
        },
    ),
])

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
