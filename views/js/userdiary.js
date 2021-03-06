'use strict'
//const url = 'https://localhost:8000' // change url when uploading to server
const url = 'https://10.114.34.20/app'

console.log('Hello do you copy?')
/* DOM elements */

const diaryList = document.querySelector('#diary-list ul')

// Backdrop
const backDrop = document.querySelector('.backdrop')

// Edit diary
const editModal = document.querySelector('#edit-modal')
const editForm = document.querySelector('#edit-form')
const cancelEditModal = editModal.querySelector('button[name = "cancel"')

// Remove diary
const publishModal = document.querySelector('#publish-diary-modal')
const publishSelectedDiary = publishModal.querySelector(
  'button[name = "publish"'
)
const cancelPublishModal = publishModal.querySelector('button[name = "cancel"')

// Remove diary
const removeModal = document.querySelector('#remove-diary-modal')
const removeSelectedDiary = removeModal.querySelector('button[name = "remove"')
const cancelRemoveModal = removeModal.querySelector('button[name = "cancel"')

// Remove from public
const removeFromPublicDiary = document.querySelector(
  '#remove-public-diary-modal'
)
const removePublicSelectedDiary = removeFromPublicDiary.querySelector(
  'button[name = "remove"'
)
const cancelPublicRemoveModal = removeFromPublicDiary.querySelector(
  'button[name = "cancel"'
)

console.log('cancelPublicRemoveModal', cancelPublicRemoveModal)

// View diary
const viewModal = document.querySelector('#view-diary-modal')
const closeViewModal = viewModal.querySelector('button[name = "close"')

console.log('modal', editModal)
console.log('editForm', editForm)
console.log('cancelEditModal', cancelEditModal)
console.log('cancelRemoveModal', cancelRemoveModal)

/* END */

/* FUNCTIONS */

// Fetch public day entries
const fetchPublicDayEntries = async () => {
  console.log('Get token:', localStorage.getItem('token'))

  try {
    const options = {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    }
    const response = await fetch(url + '/diary/all', options)
    const diaryEntries = await response.json()
    return diaryEntries
  } catch (err) {
    console.log('err.message', err.message)
  }
}

// Fetch user day entries
const fetchDayEntries = async () => {
  {
    console.log('Get token:', localStorage.getItem('token'))

    try {
      const options = {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      }
      const response = await fetch(url + '/diary/user', options)
      const diaryEntries = await response.json()

      console.log('diaryEntries', diaryEntries)
      return diaryEntries
    } catch (err) {
      console.log(err.message)
    }
  }
}

// Logout
const logOut = document.querySelector('#logout-anchor')
logOut.addEventListener('click', () => {
  localStorage.removeItem('token')
})

const closeAllModals = () => {
  backDrop.classList.add('hide')

  console.log('close All modals')
  viewModal.classList.add('hide')
  editModal.classList.add('hide')
  removeModal.classList.add('hide')
  removeFromPublicDiary.classList.add('hide')
  publishModal.classList.add('hide')
}

// Cancel and view edit diary entry modal
const cancelEditFunc = () => {
  console.log('This is cancel edit func!')
  editForm.removeAttribute('id')

  closeAllModals()
}
// Cancel edit diary modal func listener
cancelEditModal.addEventListener('click', cancelEditFunc)

// Show edit diary modal
const showEditDiaryModal = (dayEntry) => {
  closeAllModals()

  console.log('dayEntry modal', dayEntry)
  console.log('epic id', dayEntry.dayEntryId)
  editForm.setAttribute('id', dayEntry.dayEntryId)

  editForm.querySelector('.title').value = dayEntry.title
  editForm.querySelector('.note-text').value = dayEntry.noteText

  console.log('dayEntry.filename', dayEntry.filename)

  console.log('image dom', editModal.querySelector('.image'))

  dayEntry.filename
    ? (editModal.querySelector('.image').src =
        url + '/thumbnails/' + dayEntry.filename)
    : (editModal.querySelector('.image').src = '../images/no-image.jpg')

  console.log('image dom after', editModal.querySelector('.image'))

  console.log('dayEntry.dateTime', dayEntry.dateTime.substring(0, 10))

  editForm.querySelector('.date-time').value = dayEntry.dateTime.substring(
    0,
    10
  )

  editForm.querySelectorAll('input[name="mood"]').forEach((mood) => {
    if (mood.value == dayEntry.mood) {
      mood.checked = true
    }
  })

  editForm.querySelector('.things').value = dayEntry.things

  console.log("editForm's id", editForm.id)

  editModal.classList.remove('hide')
  backDrop.classList.remove('hide')
}

// View diary entry
const viewDiaryModal = (dayEntry) => {
  closeAllModals()

  viewModal.querySelector('.title').innerHTML = dayEntry.title
  viewModal.querySelector('.note-text').innerHTML = dayEntry.noteText

  dayEntry.filename
    ? (viewModal.querySelector('.image').src =
        url + '/thumbnails/' + dayEntry.filename)
    : (viewModal.querySelector('.image').src = '../images/no-image.jpg')

  viewModal.querySelector('.datetime').innerHTML = dayEntry.dateTime.substring(
    0,
    10
  )
  viewModal.querySelector('.mood').innerHTML = dayEntry.mood
  viewModal.querySelector('.things').innerHTML = dayEntry.things

  viewModal.classList.remove('hide')
  backDrop.classList.remove('hide')
}

closeViewModal.addEventListener('click', () => {
  closeAllModals()
})

removeSelectedDiary.addEventListener('click', async () => {
  closeAllModals()

  const options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
  }

  console.log(options)
  const response = await fetch(
    url + '/diary/user/' + removeSelectedDiary.id,
    options
  )

  removeSelectedDiary.removeAttribute('id')

  const json = await response.json()
  console.log('updated response', json)

  getDiaryEntries()
})

// Remove public selected diary
removePublicSelectedDiary.addEventListener('click', async () => {
  closeAllModals()

  const options = {
    method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
  }

  const response = await fetch(
    url + '/diary/all/' + removePublicSelectedDiary.id,
    options
  )

  const json = await response.json()

  removePublicSelectedDiary.removeAttribute('id')

  console.log('updated response', json)

  getDiaryEntries()
})

cancelPublicRemoveModal.addEventListener('click', () => {
  removePublicSelectedDiary.removeAttribute('id')

  closeAllModals()
})

const showRemoveFromPublicModal = (id) => {
  closeAllModals()

  console.log('showRemoveFromPublicModal id', id)
  removePublicSelectedDiary.setAttribute('id', id)

  console.log("showRemoveFromPublicModal's id", removePublicSelectedDiary.id)
  removeFromPublicDiary.classList.remove('hide')
  backDrop.classList.remove('hide')
}

// Cancel remove diary entry modal
const cancelRemoveFunc = () => {
  removeSelectedDiary.removeAttribute('id')

  closeAllModals()
}

cancelRemoveModal.addEventListener('click', cancelRemoveFunc)

// Show remove diary modal
const showRemoveDiaryModal = (id) => {
  closeAllModals()

  console.log('removeSelectedDiary id', id)
  removeSelectedDiary.setAttribute('id', id)

  console.log("removeSelectedDiary's id", removeSelectedDiary.id)
  removeModal.classList.remove('hide')
  backDrop.classList.remove('hide')
}

publishSelectedDiary.addEventListener('click', async () => {
  closeAllModals()

  console.log('THIS IS DATE', new Date().toISOString())

  const params = {
    createdAt: new Date().toISOString(),
    dayEntryId: Number(publishSelectedDiary.id),
  }

  console.log('publish Diary params', params)
  console.log('publish Diary params stringify', JSON.stringify(params))
  console.log('publish Diary jwt token', localStorage.getItem('token'))

  const options = {
    method: 'POST',
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: JSON.stringify(params),
    redirect: 'follow', // manual, *follow, error
    referrer: 'no-referrer', // no-referrer, *client
  }
  try {
    console.log(options)
    const response = await fetch(url + '/diary/all', options)
    const json = await response.json()

    console.log('publish diary response.json', json)
    console.log('publish diary response', response)

    publishSelectedDiary.removeAttribute('id')
    console.log(
      'publishSelectedDiary after publishing',
      publishSelectedDiary.id
    )
  } catch (error) {
    console.log('error.message', error.message)
  }

  getDiaryEntries()
})

cancelPublishModal.addEventListener('click', () => {
  publishSelectedDiary.removeAttribute('id')

  closeAllModals()
})

const showPublishDiaryModal = (id) => {
  closeAllModals()

  console.log('showPublishDiaryModal id', id)
  publishSelectedDiary.setAttribute('id', id)

  console.log("showPublishDiaryModal's id", removeSelectedDiary.id)

  publishModal.classList.remove('hide')
  backDrop.classList.remove('hide')
}

const createDiaryListItem = (userDayEntries, publicDayEntries) => {
  diaryList.innerHTML = ''

  userDayEntries.forEach((dayEntry) => {
    console.log('dayEntry ja näin', dayEntry)
    const li = document.createElement('li')
    li.className = 'day-entry-item'

    const div = document.createElement('div')

    const h1 = document.createElement('h1')
    h1.innerHTML = dayEntry.title

    console.log('h1.innerHTML not working?', h1)
    h1.addEventListener('click', () => viewDiaryModal(dayEntry))

    const h2 = document.createElement('h2')
    h2.innerHTML = dayEntry.dateTime
      ? new Date(dayEntry.dateTime).toLocaleDateString()
      : '(Date not available)'

    if (dayEntry.filename) {
      const img = document.createElement('img')
      img.src = url + '/thumbnails/' + dayEntry.filename
      img.alt = dayEntry.title
    }

    console.log('dayEntry', dayEntry)
    console.log('publicDayEntries', publicDayEntries)

    console.log(
      'publicDayEntry',
      publicDayEntries.some(
        (publicEntry) => publicEntry.dayEntryId === dayEntry.dayEntryId
      )
    )

    // Edit
    const editBtn = document.createElement('button')
    editBtn.className = 'btn'
    editBtn.innerHTML = 'Edit'
    editBtn.addEventListener('click', () => showEditDiaryModal(dayEntry))

    // Remove
    const removeBtn = document.createElement('button')
    removeBtn.className = 'btn'
    removeBtn.innerHTML = 'Remove'

    let publishBtn, alreadyPublished

    const isPublished = publicDayEntries.some(
      (entry) => entry.dayEntryId === dayEntry.dayEntryId
    )

    if (isPublished) {
      alreadyPublished = document.createElement('h2')
      alreadyPublished.innerHTML = 'Already published'

      removeBtn.addEventListener('click', () =>
        showRemoveFromPublicModal(dayEntry.dayEntryId)
      )
    } else {
      // Publish
      publishBtn = document.createElement('button')
      publishBtn.className = 'btn'
      publishBtn.innerHTML = 'Publish'

      publishBtn.addEventListener('click', () =>
        showPublishDiaryModal(dayEntry.dayEntryId)
      )

      removeBtn.addEventListener('click', () =>
        showRemoveDiaryModal(dayEntry.dayEntryId)
      )

      //editBtn.addEventListener('click', () => showEditDiaryModal(dayEntry))
    }

    div.appendChild(h1)
    div.appendChild(h2)
    if (alreadyPublished) div.appendChild(alreadyPublished)
    li.appendChild(div)
    li.appendChild(editBtn)
    if (publishBtn) li.appendChild(publishBtn)
    li.appendChild(removeBtn)
    diaryList.appendChild(li)
  })
}

const getDiaryEntries = async () => {
  console.log('Get token:', localStorage.getItem('token'))

  const userDayEntries = await fetchDayEntries()
  console.log('getDiaryEntries', userDayEntries)

  const publicDayEntries = await fetchPublicDayEntries()
  console.log('getPublicDiaryEntries', publicDayEntries)

  createDiaryListItem(userDayEntries, publicDayEntries)
}

editForm.addEventListener('submit', async (evt) => {
  evt.preventDefault()

  const fd = new FormData(editForm)
  fd.append('dayEntryId', editForm.getAttribute('id'))

  console.log('FD type', typeof fd)
  const options = {
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
    },
    body: fd,
  }

  console.log(options)
  const response = await fetch(url + '/diary/user', options)
  const json = await response.json()

  //editForm.removeAttribute('id')

  closeAllModals()

  console.log('updated response', json)
  getDiaryEntries()
})

getDiaryEntries()
