import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './Header';
import EventList from './EventList';
import Event from './Event';
import EventForm from './EventForm';
import { handleAjaxError } from '../helpers/helpers';
import { success } from '../helpers/notifications';


const Editor = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [isError, setIsError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await window.fetch('/api/events');
        if (!response.ok) throw Error(response.statusText);
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        // setIsError(true);
        handleAjaxError(error);
      }

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const addEvent = async (newEvent) => {
    //newEventオブジェクトを受け取り、そのデータを用いて新しいイベントを作成するリクエストをAPIに送信
    try {
      const response = await window.fetch('/api/events', { //newEventをpostリクエスト
        method: 'POST',
        body: JSON.stringify(newEvent),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw Error(response.statusText);

      const savedEvent = await response.json(); //保存したイベントのレスポンスデータが帰ってくるまで待機
      const newEvents = [...events, savedEvent];
      setEvents(newEvents); //ステートの更新
      success('Event Added!'); //flashメッセージ追加
      navigate(`/events/${savedEvent.id}`);
      // useNavigateフックによって利用可能になったnavigate関数は、URLを新しく作成されたイベントのものに更新する。
    } catch (error) {
      handleAjaxError(error);
    }
  };

  const deleteEvent = async (eventId) => {
    const sure = window.confirm('Are you sure?');

    if (sure) { //アラートメッセージでokが押されたら
      try {
        const response = await window.fetch(`/api/events/${eventId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw Error(response.statusText);

        success('Event Deleted!'); //flash
        navigate('/events'); //リダイレクト
        setEvents(events.filter(event => event.id !== eventId)); //削除されたイベント(eventId)を除くイベント配列を取得
      } catch (error) {
        handleAjaxError(error);
      }
    }
  };

  const updateEvent = async (updatedEvent) => {
    try {
      const response = await window.fetch(
        `/api/events/${updatedEvent.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updatedEvent),
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw Error(response.statusText);

      const newEvents = events;
      const idx = newEvents.findIndex((event) => event.id === updatedEvent.id);
      newEvents[idx] = updatedEvent;
      // newEvents配列内の更新されたイベントのインデックスを決定し、古いイベントを新しいイベントに差し替える
      setEvents(newEvents); //ステートの更新

      success('Event Updated!');//flash
      navigate(`/events/${updatedEvent.id}`);//リダイレクト
    } catch (error) {
      handleAjaxError(error);
    }
  };

  return (
    <>
      <Header />
      <div className="grid">
        {/* {isError && <p>Something went wrong. Check the console.</p>} */}
        {isLoading ? (
          <p className='loading'>Loading...</p>
        ) : (
          <>
            <EventList events={events} />

            <Routes>
            <Route
              path=":id/edit"
              element={<EventForm events={events} onSave={updateEvent} />}
            />
              <Route path="new" element={<EventForm onSave={addEvent} />} />
              <Route path=":id" element={<Event events={events} onDelete={deleteEvent} />} />
            </Routes>
          </>
        )}
      </div>
    </>
  );
};

export default Editor;