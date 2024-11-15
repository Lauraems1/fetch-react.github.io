//import React from 'react';
import React, { useState, useEffect, useReducer, Fragment } from 'react';
import ReactDOM from 'react-dom/client';
import { Container, Button } from 'react-bootstrap'; // Change ReactBootstrap for { Button }
import axios from 'axios';
import './App.css';
import './index.css';
//import reportWebVitals from './reportWebVitals';

const Pagination = ({ items, pageSize, onPageChange }) => {
  if (items.length <= 1) return null;

  let num = Math.ceil(items.length / pageSize);
  let pages = range(1, num + 1);
  const list = pages.map(page => {
    return (
      <Button key={page} onClick={onPageChange} className="page-item">
        {page}
      </Button>
    );
  });
  return (
    <nav>
      <ul className="pagination">{list}</ul>
    </nav>
  );
};
const range = (start, end) => {
  return Array(end - start + 1)
    .fill(0)
    .map((item, i) => start + i);
};
function paginate(items, pageNumber, pageSize) {
  const start = (pageNumber - 1) * pageSize;
  let page = items.slice(start, start + pageSize);
  return page;
}

const useDataApi = (initialUrL, initialData) => {
//const { useState, useEffect, useReduce } = React;
const [url, setUrl] = useState(initialUrL);

const [state, dispatch] = useReducer(dataFetchReducer, {
  isLoading: false,
  isError: false,
  data: initialData
});

useEffect(() => {
  let didCancel = false;
  const fetchData = async () => {
    dispatch({ type: "FETCH_INIT" });
    try {
      const result = await axios(url);
      if (!didCancel) {
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      }
    } catch (error) {
      if (!didCancel) {
        dispatch({ type: "FETCH_FAILURE" });
      }
    }
  };
  fetchData();
  return () => {
    didCancel = true;
  };
}, [url]);
return [state, setUrl];
};
const dataFetchReducer = (state, action) => {
switch (action.type) {
  case "FETCH_INIT":
    return {
      ...state,
      isLoading: true,
      isError: false
    };
  case "FETCH_SUCCESS":
    return {
      ...state,
      isLoading: false,
      isError: false,
      data: action.payload
    };
  case "FETCH_FAILURE":
    return {
      ...state,
      isLoading: false,
      isError: true
    };
  default:
    throw new Error();
}
};

function App() {
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("MIT");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "https://hn.algolia.com/api/v1/search?query=MIT",
    {
      hits: []
    }
  );

  const handlePageChange = e => {
    setCurrentPage(Number(e.target.textContent));
  };
  let page = data.hits;
  if (page.length >= 1) {
    page = paginate(page, currentPage, pageSize);
    console.log(`currentPage: ${currentPage}`);
  }

  return (
    <Fragment>

      <form
        onSubmit={event => {
          doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
          event.preventDefault();
        }}
      >
      <input
        type="text"
        value={query}
        onChange={event => setQuery(event.target.value)}
      />
      <Button type="submit" class="btn btn-outline-primary">Search</Button>
      </form>

      {isError && <div>Something went wrong ...</div>}

      {isLoading ? (
        <div>Loading ...</div>
      ) : (

        <ul class="list-group">
        {page.map(item => (
          <li class="list-group-item" key={item.objectID}>
            <a href={item.url}>{item.title}</a>
          </li>
        ))}

      </ul>
      )}

      <Pagination
        items={data.hits}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      ></Pagination>
    </Fragment>
  );
}

export default App;
