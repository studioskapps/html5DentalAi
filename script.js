const video = document.getElementById('myVideo');
const buttonContainer = document.getElementById('buttonContainer');
const welcomeMessage = document.getElementById('welcomeMessage');
const playIcon = document.getElementById('playIcon');
const questionContainer = document.getElementById('questionContainer');

// Three.js ile 3D ağız modeli
let scene, camera, renderer, mouthModel;

function init3DModel() {
    // Sahne oluştur
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(300, 300); // Model boyutu
    document.getElementById('mouthContainer').appendChild(renderer.domElement); // Canvas'ı ekle

    // 3D ağız modelini yükle
    const loader = new THREE.GLTFLoader();
    loader.load('model.glb', function (gltf) {
        mouthModel = gltf.scene;
        scene.add(mouthModel);
        mouthModel.visible = false; // Başlangıçta gizli
    });

    camera.position.z = 5;

    // Animasyonu başlat
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (mouthModel) {
        mouthModel.rotation.y += 0.01; // Modeli döndür
    }
    renderer.render(scene, camera);
}

// Play simgesine tıklama olayını tanımla
playIcon.addEventListener('click', playVideo);

// Videoyu başlat
function playVideo() {
    video.play(); // Videoyu başlat
    playIcon.style.display = 'none'; // Play simgesini gizle
    video.currentTime = 0; // Videoyu başlangıçta başlat

    // Videonun 2. saniyesinde durmasını sağla
    video.ontimeupdate = function() {
        if (video.currentTime >= 2 && video.currentTime < 3) {
            video.pause(); // Videoyu durdur
            welcomeMessage.style.display = 'none'; // Mesajı gizle
            buttonContainer.style.display = 'flex'; // İlk butonları göster
            video.ontimeupdate = null; // Olay dinleyicisini kaldır
        }
    };
}

// Videoyu kaldığı yerden devam ettir
function continueVideo() {
    video.play(); // Videoyu devam ettir

    // Videonun 5. saniyesinde durmasını sağla
    video.ontimeupdate = function() {
        if (video.currentTime >= 5 && video.currentTime < 6) {
            video.pause(); // Videoyu durdur
            buttonContainer.style.display = 'none'; // İlk butonları gizle
            questionContainer.style.display = 'flex'; // İkinci soru butonlarını göster
            video.ontimeupdate = null; // Olay dinleyicisini kaldır
        }
    };
}

// İlk butonlara olay dinleyicilerini ekle
document.querySelectorAll('#buttonContainer button').forEach(button => {
    button.addEventListener('click', function() {
        continueVideo(); // İlk butona tıklandığında video devam eder
        buttonContainer.style.display = 'none'; // Butonları gizle
    });
});

// Sorulardan birine tıklanırsa video devam ettir
document.querySelectorAll('#questionContainer button').forEach(button => {
    button.addEventListener('click', function() {
        // Sorular için video akışını başlat
        video.play(); // Videoyu devam ettir
        questionContainer.style.display = 'none'; // Soru butonlarını gizle

        // Videonun belirli bir saniyede durmasını sağla (örneğin, 10. saniye)
        video.ontimeupdate = function() {
            if (video.currentTime >= 10 && video.currentTime < 11) {
                video.pause(); // Videoyu durdur
                mouthModel.visible = true; // 3D ağız modelini göster
                video.ontimeupdate = null; // Olay dinleyicisini kaldır
            }
        };
    });
});

// Video dosyasının süresini kontrol et
video.addEventListener('ended', function() {
    // Video bittiğinde butonları gizle
    buttonContainer.style.display = 'none';
    questionContainer.style.display = 'none';
});

// 3D modelin ilk yüklemesini başlat
init3DModel();
