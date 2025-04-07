import { Navbar, Nav, Form, FormControl, Button, Container } from 'react-bootstrap';
import Link from 'next/link';
import { NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAtom } from 'jotai';
import { searchHistoryAtom } from '@/store';
import { addToHistory } from '@/lib/userData';
import { readToken, removeToken } from '@/lib/authenticate';

export default function MainNav() {
  const [search, setSearch] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const token = readToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (search.trim()) {
      const queryString = `title=true&q=${search}`;
      setSearchHistory(await addToHistory(queryString));
      router.push(`/artwork?${queryString}`);
      setIsExpanded(false);
    }
  };

  const logout = () => {
    setIsExpanded(false);
    removeToken();
    router.push('/login');
  };

  const toggleNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const closeNavbar = () => {
    setIsExpanded(false);
  };

  return (
    <>
      <Navbar className="fixed-top navbar-dark bg-primary" expand="lg" expanded={isExpanded}>
        <Container>
          <Navbar.Brand>
            Thi Mai Phuong Vu
            {token && ` - Welcome ${token.userName}`}
          </Navbar.Brand>
          <Navbar.Toggle onClick={toggleNavbar} />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Link href="/" passHref legacyBehavior>
                <Nav.Link onClick={closeNavbar} active={router.pathname === '/'}>Home</Nav.Link>
              </Link>
              {token && (
                <>
                  <Link href="/search" passHref legacyBehavior>
                    <Nav.Link onClick={closeNavbar} active={router.pathname === '/search'}>Advanced Search</Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
            
            {token && (
              <Form className="d-flex" onSubmit={handleSubmit}>
                <FormControl
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button type="submit" variant="success">Search</Button>
              </Form>
            )}

            <Nav>
              {token ? (
                <NavDropdown title={token.userName} id="user-dropdown">
                  <Link href="/favourites" passHref legacyBehavior>
                    <NavDropdown.Item onClick={closeNavbar}>Favourites</NavDropdown.Item>
                  </Link>
                  <Link href="/history" passHref legacyBehavior>
                    <NavDropdown.Item onClick={closeNavbar}>Search History</NavDropdown.Item>
                  </Link>
                  <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <>
                  <Link href="/register" passHref legacyBehavior>
                    <Nav.Link onClick={closeNavbar} active={router.pathname === '/register'}>Register</Nav.Link>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <Nav.Link onClick={closeNavbar} active={router.pathname === '/login'}>Login</Nav.Link>
                  </Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
    </>
  );
}