from datetime import datetime, timedelta
from flask import Flask, render_template, url_for, request, redirect
from flask_sqlalchemy import SQLAlchemy
from forms import TurnOnTeapodForm


app = Flask(__name__)
app.config.from_pyfile('config.py')


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///teapod.db'
db = SQLAlchemy(app)


class TeaPod(db.Model):
    """
    Создаем модель чайника для дальнейшего создания таблицы в БД
    """
    id = db.Column(db.Integer, primary_key = True)
    power = db.Column(db.Float, nullable=False)
    water_volume = db.Column(db.Float, nullable=False)
    water_start_temp = db.Column(db.Float, nullable=False)
    water_level = db.Column(db.Float, nullable=False)
    turn_on_date = db.Column(db.DateTime)
    turn_off_date = db.Column(db.DateTime)
    is_boiled = db.Column(db.Boolean)
    is_stopped_by_user = db.Column(db.Boolean)
    turn_off_temperature = db.Column(db.Float)

    def __repr__(self):
        return f'Запуск номер {id}:\n power'


@app.route("/", methods=['POST', 'GET'])
def index():
    """
    При нажатии на кнопки включить/выключить срабатывает этот метод,
    данные из формы проходят валидацию, при положительной валидации сохраняются в БД,
    при отрицательной нет.
    :return:
    """
    form1 = TurnOnTeapodForm()
    if request.method == "POST":
        if form1.is_stopped_by_user.data == 0 and form1.is_boiled.data == 0:
            turn_off_date = None
            turn_on_date = datetime.now().replace(microsecond=0)
        else:
            turn_off_date = datetime.now().replace(microsecond=0)
            turn_on_date = turn_off_date - timedelta(seconds = 4183 * float(form1.water_level.data) * (100 - float(form1.water_temp.data)) / float(form1.power.data))
        try:
            teapod = TeaPod(
                power=form1.power.data,
                water_volume=form1.water_volume.data,
                water_level=form1.water_level.data,
                water_start_temp = form1.water_temp.data,
                turn_on_date= turn_on_date,
                turn_off_date=turn_off_date,
                is_boiled = form1.is_boiled.data,
                is_stopped_by_user = form1.is_stopped_by_user.data,
                turn_off_temperature = form1.turn_off_temperature.data
            )
            db.session.add(teapod)
            db.session.flush()
            db.session.commit()
            return redirect(url_for('index'))
        except:
            db.session.rollback()
            print('Ошибка добавления в БД')

    return render_template('index.html', form1 = form1)#, form2 = form2)

@app.route("/posts")
def boiling_schedule():
    '''
    Функция отображения записей БД на странице /posts
    :return:
    '''
    title = 'Записи БД'
    outputs = TeaPod.query.all()
    return render_template('posts.html', outputs = outputs, title=title)


@app.errorhandler(404)
def pageNotFound(error):
    '''
    Обработчик ошибки 404
    :return:
    '''
    return render_template('page404.html', title = 'Страница не найдена'), 404

if __name__ == '__main__':
    app.run(debug=True)