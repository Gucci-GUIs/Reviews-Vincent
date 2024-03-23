import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 0 },
    { duration: '5s', target: 10 },
    { duration: '5s', target: 100 },
    { duration: '10s', target: 1000 },
  ],
};

export default function () {
  const random = Math.floor(Math.random() * 30000);
  http.get(`http://localhost:3000/api/reviews/meta/${random}`);
  sleep(1);
}
