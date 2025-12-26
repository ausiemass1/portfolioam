/* global M $ */
document.addEventListener("DOMContentLoaded", function () {
  var elems = document.querySelectorAll(".sidenav");
  M.Sidenav.init(elems);
});

$(document).ready(function () {
  // Initialize the dropdown
  $(".dropdown-trigger").dropdown();
});


// cart superscript
function updateCartBadge(totalQuantity) {
  document.querySelectorAll("#cart-count").forEach(badge => {
    if (totalQuantity > 0) {
      badge.textContent = totalQuantity;
      badge.style.display = "flex";

      // 🔥 Force repaint (Materialize fix)
      badge.style.visibility = "hidden";
      badge.offsetHeight; // force reflow
      badge.style.visibility = "visible";
    } else {
      badge.style.display = "none";
    }
  });
}


// increment, decreament and remove
document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("increment")) {
      updateCart("increment", e.target.dataset.id);
    }

    if (e.target.classList.contains("decrement")) {
      updateCart("decrement", e.target.dataset.id);
    }

    if (e.target.classList.contains("remove")) {
      updateCart("remove", e.target.dataset.id);
    }
  });

  async function updateCart(action, productId) {
  try {
    const res = await fetch(`/cart/${action}/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" }
    });

    const data = await res.json();
    if (!data.success) return;

    if (action === "remove" || data.item.quantity === 0) {
      document
        .querySelector(`[data-qty-id="${productId}"]`)
        ?.closest(".cart-row")
        .remove();
    } else {
      document.querySelector(`[data-qty-id="${productId}"]`).innerText =
        data.item.quantity;

      document.querySelector(`[data-total-id="${productId}"]`).innerText =
        `$${(data.item.price * data.item.quantity).toFixed(2)}`;
    }

    document.querySelector("#cart-subtotal").innerText =
      `$${data.cart.totalPrice.toFixed(2)}`;
    document.querySelector("#cart-total").innerText =
      `$${data.cart.totalPrice.toFixed(2)}`;

    // 🔥 THIS WAS MISSING
    updateCartBadge(data.cart.totalQuantity);

  } catch (err) {
    console.error("Cart update failed", err);
  }
}



