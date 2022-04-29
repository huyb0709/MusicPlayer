const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'MUSIC_PLAYER'
const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Cứ Chill Thôi",
          singer: "Chillies",
          path: "https://data3.chiasenhac.com/downloads/2102/4/2101455-ee613ff9/128/Cu%20Chill%20Thoi%20-%20Chillies_%20Suni%20Ha%20Linh_.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Tu Phir Se Aana",
          singer: "Raftaar x Salim Merchant x Karma",
          path: "https://data3.chiasenhac.com/downloads/2115/4/2114563-f91b8ba8/128/Ngay%20Tho%20-%20Tang%20Duy%20Tan_%20Phong%20Max.mp3",
          image:
            "https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg"
        },
        {
          name: "Naachne Ka Shaunq",
          singer: "Raftaar x Brobha V",
          path:
            "https://mp3.filmysongs.in/download.php?id=Naachne Ka Shaunq Raftaar Ft Brodha V Mp3 Hindi Song Filmysongs.co.mp3",
          image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg"
        },
        {
          name: "Mantoiyat",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "https://mp3.vlcmusic.com/download.php?track_id=14448&format=320",
          image:
            "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg"
        },
        {
          name: "Aage Chal",
          singer: "Raftaar",
          path: "https://mp3.vlcmusic.com/download.php?track_id=25791&format=320",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Damn",
          singer: "Raftaar x kr$na",
          path:
            "https://mp3.filmisongs.com/go.php?id=Damn%20Song%20Raftaar%20Ft%20KrSNa.mp3",
          image:
            "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg"
        },
        {
          name: "Feeling You",
          singer: "Raftaar x Harjas",
          path: "https://mp3.vlcmusic.com/download.php?track_id=27145&format=320",
          image:
            "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp"
        }
    ],
    setConfig: function(key,value){
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config))
    },
    render: function(){
        const htmls = this.songs.map((song, index) => {
            return  `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index='${index}'>
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
      Object.defineProperty(this,'currentSong',{
          get:function(){
              return this.songs[this.currentIndex]
          }
      })  
    },
    handleEvent: function(){
      const _this = this
      const cdWidth = cd.offsetWidth 
      // Xu ly CD quay/dung
      const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)' }
      ],{
          duration: 10000,
          interations: Infinity 
        })
      cdThumbAnimate.pause()
      // Xu ly phong to, thu nho
      document.onscroll = function(){
          const scrollTop = window.scrollY || document.documentElement.scrollTop
          const newCdWidth  = cdWidth - scrollTop 

          cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
          cd.style.opacity = newCdWidth / cdWidth
        }
      // Xu li khi click play
      playBtn.onclick = function(){
        if(_this.isPlaying){
          audio.pause()
        } else{
          audio.play()
        }
      }
      // Khi bai hat dc play
      audio.onplay = function(){
        _this.isPlaying = true;
        player.classList.add('playing')
        cdThumbAnimate.play()
      }
      // Khi bai hat dc pause
      audio.onpause = function(){
        _this.isPlaying = false;
        player.classList.remove('playing')
        cdThumbAnimate.pause()
      }
      // Khi tien do bai hat thay doi
      audio.ontimeupdate = function(){
        if(audio.duration){
          const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
          progress.value = progressPercent
        }
      }
      // Xu li khi tua nhac
      progress.oninput = function(e){
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime
      }
      //Khi next song
      nextBtn.onclick = function(){
        if(_this.isRandom){
          _this.playRandomSong()
        }else {
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scollToActiveSong()
      }
      //Khi prev song
      prevBtn.onclick = function(){
        if(_this.isRandom){
          _this.playRandomSong()
        }else {
          _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scollToActiveSong()
      }
      //Xu ly random bat/tat 
      randomBtn.onclick = function(e){
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom',_this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)

      } 
      //Xu ly repeat song
      repeatBtn.onclick = function(){
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat',_this.isRepeat)
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }
      // 
      audio.onended = function(){
        if(_this.isRepeat){
          audio.play()
        } else{
          nextBtn.click()
        }
      }
      //Click vao playlist
      playlist.onclick = function(e){
        const songNode = e.target.closest('.song:not(.active)')
        if(songNode || e.target.closest('.option'))
        {
          //Xu li khi click vao song
          if(songNode){
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong()
            audio.play()
            _this.render()
          }
          //Xu li khi click vao option
          if(e.target.closest('.option')){

          }
        }
      }
    },
    scollToActiveSong: function(){
      setTimeout(() =>{
        $('.song.active').scollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 300)
    },
    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function(){
      this.isRandom = this.config.isRandom
      this.isRepeat = this.config.isRepeat
    },
    nextSong: function(){
      this.currentIndex++;
      if(this.currentIndex >= this.songs.length){
        this.currentIndex = 0;
      }
      this.loadCurrentSong();
    },
    prevSong: function(){
      this.currentIndex--;
      if(this.currentIndex <0){
        this.currentIndex = this.songs.length -1;
      }
      this.loadCurrentSong();
    },
    playRandomSong: function(){
      let newIndex
      do{
        newIndex = Math.floor(Math.random() * this.songs.length)
      } while(newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    start: function(){  
        this.loadConfig();
        //
        this.defineProperties();
        //
        this.handleEvent();
        //
        this.loadCurrentSong()
        //
        this.render();
        randomBtn.classList.toggle('active', _this.isRandom)
        repeatBtn.classList.toggle('active', _this.isRepeat)
    }  
}
app.start()
