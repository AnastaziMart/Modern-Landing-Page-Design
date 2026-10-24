const menuButton = document.querySelector(".menu-button")
const navLinks = document.querySelector(".nav-links")

menuButton?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open")
  menuButton.setAttribute("aria-expanded", String(isOpen))
  menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu")
  menuButton.querySelector("span").textContent = isOpen ? "Close" : "Menu"
})

navLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open")
    menuButton?.setAttribute("aria-expanded", "false")
    menuButton?.setAttribute("aria-label", "Open menu")
    const label = menuButton?.querySelector("span")
    if (label) label.textContent = "Menu"
  })
})

const cameraButton = document.querySelector("#camera-button")
const photoInput = document.querySelector("#try-on-photo")
const video = document.querySelector("#mirror-video")
const photo = document.querySelector("#mirror-photo")
const placeholder = document.querySelector("#mirror-placeholder")
const necklace = document.querySelector("#necklace-overlay")
const fitControls = document.querySelector("#fit-controls")
const resetButton = document.querySelector("#reset-mirror")
const message = document.querySelector("#mirror-message")
const sizeInput = document.querySelector("#necklace-size")
const heightInput = document.querySelector("#necklace-height")
const sizeValue = document.querySelector("#size-value")
const heightValue = document.querySelector("#height-value")

let cameraStream = null
let photoUrl = null

function stopCamera() {
  cameraStream?.getTracks().forEach((track) => track.stop())
  cameraStream = null
  video.srcObject = null
}

function setMessage(text = "") {
  message.textContent = text
  message.hidden = !text
}

function showTryOn(mode) {
  placeholder.hidden = true
  video.hidden = mode !== "camera"
  photo.hidden = mode !== "photo"
  necklace.hidden = false
  fitControls.disabled = false
  resetButton.hidden = false
  cameraButton.textContent =
    mode === "camera" ? "Restart camera" : "Use my camera"
}

async function startCamera() {
  setMessage()
  if (!navigator.mediaDevices?.getUserMedia) {
    setMessage(
      "Camera access is not available in this browser. Try uploading a photo instead.",
    )
    return
  }

  try {
    stopCamera()
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: "user",
        width: { ideal: 1280 },
        height: { ideal: 1280 },
      },
      audio: false,
    })
    showTryOn("camera")
    video.srcObject = cameraStream
    await video.play()
  } catch {
    setMessage(
      "Camera permission was not granted. You can still upload a selfie below.",
    )
  }
}

function choosePhoto(event) {
  const file = event.target.files?.[0]
  if (!file) return

  stopCamera()
  if (photoUrl) URL.revokeObjectURL(photoUrl)
  photoUrl = URL.createObjectURL(file)
  photo.src = photoUrl
  showTryOn("photo")
  setMessage()
}

function resetMirror() {
  stopCamera()
  if (photoUrl) {
    URL.revokeObjectURL(photoUrl)
    photoUrl = null
  }
  photo.removeAttribute("src")
  photoInput.value = ""
  photo.hidden = true
  video.hidden = true
  necklace.hidden = true
  placeholder.hidden = false
  fitControls.disabled = true
  resetButton.hidden = true
  cameraButton.textContent = "Use my camera"
  setMessage()
}

cameraButton?.addEventListener("click", startCamera)
photoInput?.addEventListener("change", choosePhoto)
resetButton?.addEventListener("click", resetMirror)

sizeInput?.addEventListener("input", (event) => {
  const value = event.target.value
  necklace.style.width = `${value}%`
  sizeValue.textContent = `${value}%`
})

heightInput?.addEventListener("input", (event) => {
  const value = event.target.value
  necklace.style.top = `${value}%`
  heightValue.textContent = `${value}%`
})

necklace.style.width = `${sizeInput.value}%`
necklace.style.top = `${heightInput.value}%`

document
  .querySelector("#mirror-controls")
  ?.addEventListener("submit", (event) => {
    event.preventDefault()
  })

document
  .querySelector("#newsletter-form")
  ?.addEventListener("submit", (event) => {
    event.preventDefault()
  })

window.addEventListener("pagehide", () => {
  stopCamera()
  if (photoUrl) URL.revokeObjectURL(photoUrl)
})
