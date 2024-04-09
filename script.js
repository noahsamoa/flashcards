$(document).ready(function () {
  let flashcards = JSON.parse(localStorage.getItem("flashcards")) || [
    { question: "Question 1", answer: "Answer 1", showingQuestion: true },
  ];
  let currentCardIndex = 0;
  let buttonClicked = false;

  function saveFlashcards() {
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
  }

  function renderFlashcards() {
    $("#flashcard-container").empty();
    const currentCard = flashcards[currentCardIndex];
    const headerText = currentCard.showingQuestion ? "Question" : "Answer";
    const content = currentCard.showingQuestion
      ? currentCard.question
      : currentCard.answer;
    $("#flashcard-container").append(
      `<div class="card bg-white p-6 rounded shadow-md mb-4"><div class="header">${headerText} #${
        currentCardIndex + 1
      }/${flashcards.length}</div><div class="content">${content}</div></div>`
    );
    if (!buttonClicked) {
      $("#next-card-btn")
        .text(`Next Question (${currentCardIndex + 1}/${flashcards.length})`)
        .removeClass("bg-green-500")
        .addClass("bg-blue-500")
        .text("Get Started!");
    } else {
      $("#next-card-btn")
        .text("Next Card")
        .removeClass("bg-green-500")
        .addClass("bg-blue-500");
    }
  }

  function showNextRandomCard() {
    let nextIndex = currentCardIndex;
    while (nextIndex === currentCardIndex) {
      nextIndex = Math.floor(Math.random() * flashcards.length);
    }
    currentCardIndex = nextIndex;
    flashcards[currentCardIndex].showingQuestion = true;
    renderFlashcards();
  }

  $("#next-card-btn").click(function () {
    buttonClicked = true;
    showNextRandomCard();
  });
  $(document).on("click", ".card", function () {
    const currentCard = flashcards[currentCardIndex];
    currentCard.showingQuestion = !currentCard.showingQuestion;
    renderFlashcards();
  });
  $(document).on("keydown", function (e) {
    if (
      e.keyCode === 32 &&
      $(e.target).closest("input, textarea").length === 0
    ) {
      const currentCard = flashcards[currentCardIndex];
      currentCard.showingQuestion = !currentCard.showingQuestion;
      renderFlashcards();
    }
  });

  $("#edit-deck-btn").click(function () {
    renderFlashcardsModal();
    $("#modal").removeClass("hidden");
  });
  $("#close-modal").click(function () {
    $("#modal").addClass("hidden");
  });
  $("#flashcard-form").submit(function (e) {
    e.preventDefault();
    const question = $("#question-input").val();
    const answer = $("#answer-input").val();
    flashcards.push({ question, answer, showingQuestion: true });
    saveFlashcards();
    renderFlashcardsModal();
    $(this).trigger("reset");
  });

  function renderFlashcardsModal() {
    $("#flashcard-list").empty();
    flashcards.forEach(function (card, index) {
      $("#flashcard-list").append(
        `<li class="flex justify-between items-center"><span>${card.question}</span><button class="remove-card-btn" data-index="${index}">&times;</button></li>`
      );
    });
  }
  $(document).on("click", ".remove-card-btn", function () {
    const index = $(this).data("index");
    flashcards.splice(index, 1);
    saveFlashcards();
    renderFlashcards();
    renderFlashcardsModal();
  });
  $("#close-modal-btn").click(function () {
    $("#modal").addClass("hidden");
  });
});
