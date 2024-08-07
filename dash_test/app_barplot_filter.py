import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import pandas as pd
from sqlalchemy import create_engine, text
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
query = text("""
SELECT fe.entry_date, dc.year_number, dc.season
FROM fact_entry fe
JOIN dim_calendar dc ON fe.entry_date = dc.date_cal;
""")

# Read the data into a pandas DataFrame
df = pd.read_sql(query, engine)

# Ensure 'year_number' is an integer
df['year_number'] = df['year_number'].astype(int)

# Print unique values in the 'season' column for debugging
print("Unique seasons:", df['season'].unique())

# Print year distribution for debugging purposes
print(df['year_number'].value_counts())

# Initialize the Dash app
app = dash.Dash(__name__)

# Define the layout of the app
app.layout = html.Div(children=[
    html.H1(children='Fact Entry Dashboard'),

    html.Div([
        dcc.Dropdown(
            id='season-dropdown',
            options=[
                {'label': 'All', 'value': 'all'},
                {'label': 'Été', 'value': 'été'},
                {'label': 'Hiver', 'value': 'hiver'}
            ],
            value='all',
            clearable=False
        )
    ], style={'width': '30%', 'display': 'inline-block'}),

    dcc.Graph(id='barplot')
])

# Callback to update the graph based on selected season
@app.callback(
    Output('barplot', 'figure'),
    Input('season-dropdown', 'value')
)
def update_graph(selected_season):
    print("Selected season:", selected_season)  # Debugging print statement
    if selected_season == 'all':
        filtered_df = df
    else:
        filtered_df = df[df['season'] == selected_season]
    
    # Debugging print statement to verify filtered data
    print(f"Entries for {selected_season}:")
    print(filtered_df)

    yearly_data = filtered_df.groupby('year_number').size().reset_index(name='entries')
    figure = px.bar(yearly_data, x='year_number', y='entries', labels={'year_number': 'Year', 'entries': 'Number of Entries'})
    return figure

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)