import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context'

export default function NavBar(){
    const {user, username} = useContext(UserContext)

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href='/'>
                        <button className='btn-logo'>FEED</button>
                    </Link>
                </li>

                {/* User is signed in and has username */}
                {username && (
                    <>
                    <li className='push-left'>
                        <Link href="/admin">
                            <button className='btn-blue'>Write Posts</button>
                        </Link>
                    </li>
                    <li>
                        <Link href={`/${username}`}>
                            <img src={user?.photoURL}></img>
                        </Link>
                    </li>
                    </>
                )}

                {/* User is not signed or does not have username */}
                {!username && (
                    <li>
                        <Link href='/enter'>
                            <button className='btn-blue'>Log in</button>
                        </Link>
                    </li>                    
                )}
            </ul>
        </nav>
    );
}