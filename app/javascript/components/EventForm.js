import { formatDate, isEmptyObject, validateEvent } from '../helpers/helpers';
import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import PropTypes from 'prop-types';

const EventForm = ({ events, onSave }) => {
  // const [event, setEvent] = useState({
  //   event_type: '',
  //   event_date: '',
  //   title: '',
  //   speaker: '',
  //   host: '',
  //   published: false,
  // });
  useEffect(() => { //ユーザーがイベントを編集中に「New Event」をクリックしたらフィールドがクリアされるようにする
    setEvent(initialEventState);
  }, [events]); //eventsの数が変わる⇨イベントの新規追加

  const { id } = useParams();
  // URLから得た現在のイベントのIDをReact RouterのuseParamsフックで取得(このIDは整数値か、undefinedになる)

  const defaults = {
    event_type: '',
    event_date: '',
    title: '',
    speaker: '',
    host: '',
    published: false,
  }
  // id?(=id変数の値をチェック true:findする, false:空オブジェクトを入れる)
  const currEvent = id? events.find((e) => e.id === Number(id)) : {};
  const initialEventState = { ...defaults, ...currEvent }
  // defaultsとcurrEventをマージしてinitialEventStateという新しい変数で初期化
  const [event, setEvent] = useState(initialEventState);

  const [formErrors, setFormErrors] = useState({});

  const handleInputChange = (e) => { //inputタグなどで使われるとeventオブジェクトが生成される。
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;

    // setEvent({ ...event, [name]: value });
    updateEvent(name, value);
  };

  const renderErrors = () => {
    if (isEmptyObject(formErrors)) { //エラー（入力が空）が検出されなければnull（問題なし）を返す
      return null;
    }

    return (
      <div className="errors">
        <h3>The following errors prohibited the event from being saved:</h3>
        <ul>
          {Object.values(formErrors).map((formError) => (
            <li key={formError}>{formError}</li>
          ))}
        </ul>
      </div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateEvent(event);

    if (!isEmptyObject(errors)) { //エラー内容が空でなければ（＝エラーが検出されれば）エラープロパティをステートに追加
      setFormErrors(errors);
    } else {
      // console.log(event);
      onSave(event); //Editor.jsで定義（フェッチ→追加）
    }
  };

  const dateInput = useRef(null);

  const updateEvent = (key, value) => {
    setEvent((prevEvent) => ({ ...prevEvent, [key]: value })); //関数を引数としてsetEventを呼び出す
    // eventの直前の値を受け取り、それを新しいオブジェクトに展開して、変更されたキーバリューペアを更新
  };

  useEffect(() => {
    const p = new Pikaday({
      field: dateInput.current,
      toString: date => formatDate(date),
      onSelect: (date) => {
        const formattedDate = formatDate(date);
        dateInput.current.value = formattedDate;
        updateEvent('event_date', formattedDate);
      },
    });

    // クリーンアップ用の関数を返す
    // Reactはアンマウントの前にこれを呼び出す
    return () => p.destroy();
  }, []);

  return (
    <div>
      <h2>New Event</h2>
      {renderErrors()}

      <form className="eventForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="event_type">
            <strong>Type:</strong>
            <input
              type="text"
              id="event_type"
              name="event_type"
              onChange={handleInputChange}
              value={event.event_type}
            />
          </label>
        </div>
        <div>
          <label htmlFor="event_date">
            <strong>Date:</strong>
            <input
              type="text"
              id="event_date"
              name="event_date"
              ref={dateInput}
              autoComplete="off"
              value={event.event_date}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label htmlFor="title">
            <strong>Title:</strong>
            <textarea
              cols="30"
              rows="10"
              id="title"
              name="title"
              onChange={handleInputChange}
              value={event.title}
            />
          </label>
        </div>
        <div>
          <label htmlFor="speaker">
            <strong>Speakers:</strong>
            <input
              type="text"
              id="speaker"
              name="speaker"
              onChange={handleInputChange}
              value={event.speaker}
            />
          </label>
        </div>
        <div>
          <label htmlFor="host">
            <strong>Hosts:</strong>
            <input
              type="text"
              id="host"
              name="host"
              onChange={handleInputChange}
              value={event.host}
            />
          </label>
        </div>
        <div>
          <label htmlFor="published">
            <strong>Publish:</strong>
            <input
              type="checkbox"
              id="published"
              name="published"
              onChange={handleInputChange}
              checked={event.published}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;

EventForm.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      event_type: PropTypes.string.isRequired,
      event_date: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      speaker: PropTypes.string.isRequired,
      host: PropTypes.string.isRequired,
      published: PropTypes.bool.isRequired,
    })
  ),
  onSave: PropTypes.func.isRequired,
};

EventForm.defaultProps = {
  events: [],
};