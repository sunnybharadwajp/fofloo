import { logout } from '@/actions/user_actions';

const SiteNavbarComponent = () => {
	return (
		<div>
			<nav className="flex justify-between px-3 py-2">
				<div className="left px-3 pt-2 pb-1">
					<strong>Fofloo</strong>
				</div>
				<ul className="">
					<li className="navbar-item">
						<a href="/admin">Admin</a>
					</li>
					<li className="navbar-item">
						<a href="/store">Store</a>
					</li>
					<li className="navbar-item">
						<a href="/login">Log In</a>
					</li>
					<li className="navbar-item">
						<a href="/signup">Sign Up</a>
					</li>
					<li className="navbar-item">
						<form action={logout}>
							<button>Sign out</button>
						</form>
					</li>
					<li className="navbar-item">
						<a href="/user/cart">Cart</a>
					</li>
					<li className="navbar-item">
						<a href="/user/dashboard">Dashboard</a>
					</li>
				</ul>
			</nav>
			<hr />
		</div>
	);
};

export default SiteNavbarComponent;
