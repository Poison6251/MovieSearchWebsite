// DB에서 들고오는 데이터 중 필요한 데이터만을 저장하기 위해 만든 커스텀 클래스
class movie_data {
  constructor(id, name, poster_url, overview, vote_average) {
    this._id = id;
    this._name = name;
    this._poster_url = poster_url;
    this._overview = overview;
    this._vote_average = vote_average;
  }
  getDataHTML = () => {
    return `
      <img src="https://image.tmdb.org/t/p/w500/${this._poster_url}" alt="${this._name}">
        <h3 class="movie-title">${this._name}</h3>
          <p>${this._overview}</p>
          <p>Rating: ${this._vote_average}</p>
`;
  }

  getClickEvent = () => {
    console.log(this._id);
    window.alert(`영화 id: ${this._id}`)
  }
}

// DB에서 들고 온 데이터를 저장하는 변수 혹은 필요한(또는 필터링 된) 정보를 저장하는 변수
let loadDataArr;

// api?에서 데이터를 들고 와 반환한다.
async function LoadDB() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGI4ODA1OTI5NzcyMDRjMTIwMjlkMmJjY2I5NGI5OCIsInN1YiI6IjY2Mjc5NmRlMmUyYjJjMDE2MzY3OGI4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jNz-torVApqIg5f5HoUzWaJ9Il3u79E3bsfEHMhS4tk'
    }
  };

  let response = await fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options);
  if (!response.ok) {
    throw new Error("HTTP status is ---" + response.status + "---");
  }

  return response.json();
}

// LoadDB를 통해 api?에서 데이터를 들고 와 loadDataArr에 넣고 createCards함수로 카드를 생성한다.
async function LoadData() {
  loadDataArr = await LoadDB();
  loadDataArr = loadDataArr['results'];
  createCards(loadDataArr);
}

// card_list 구역을 전부 비운 뒤 입력받은 loadDatas에서 필요한 정보만을 골라내 카드화해서 추가한다.
function createCards(loadDatas) {
  const card_list = document.getElementById("card_list");
  card_list.innerHTML = "";
  loadDatas.forEach(element => {
    const data = new movie_data(
      element.id,
      element.title,
      element.poster_path,
      element.overview,
      element.vote_average
    )

    const cardHTML = document.createElement('div');
    cardHTML.classList.add("movie_card");
    cardHTML.id = data._id;
    cardHTML.innerHTML = data.getDataHTML();
    cardHTML.addEventListener('click', (element) => {
      data.getClickEvent();
    })

    card_list.appendChild(cardHTML);

  });
}

// 입력창에 있는 값을 소문자로 변형 하여 이 값을 들고 있는 데이터만을 카드화 한다.
const searchMovie = (entertype) => {
    const searchInput = document.getElementById("search-input").value;
    createCards(loadDataArr.filter((data) => {
      const dataTitle = data['title'].toLowerCase();
      return dataTitle.includes(searchInput.toLowerCase())
    }))
}

// search-btn을 클릭 시 searchMovie함수변수를 통해 검색기능을 실행한다.
document.getElementById("search-btn").addEventListener("click", searchMovie);

// 인터넷창 실행 시 입력창으로 마우스 커서가 가도록 한다.
window.onload = function () {
  document.getElementById("search-input").focus();
}

// 최초 실행 함수
LoadData();

{/* <div class="movie_card" id="278">
            <img src="https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg" alt="The Shawshank Redemption">
            <h3 class="movie-title">The Shawshank Redemption</h3>
            <p>Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne
                begins a new life at the Shawshank prison, where he puts his accounting skills to work for an amoral
                warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates --
                including an older prisoner named Red -- for his integrity and unquenchable sense of hope.</p>
            <p>Rating: 8.704</p>
        </div> */}