from flask_wtf import FlaskForm
from wtforms import DecimalField, BooleanField, SubmitField, DateTimeField
from wtforms.validators import DataRequired
from wtforms import widgets

class TurnOnTeapodForm(FlaskForm):
    power = DecimalField()
    water_volume = DecimalField()
    water_level = DecimalField()
    water_temp = DecimalField()
    submit1 = SubmitField('Включить')
    is_stopped_by_user = BooleanField()
    is_boiled = BooleanField()
    turn_off_temperature = DecimalField()
