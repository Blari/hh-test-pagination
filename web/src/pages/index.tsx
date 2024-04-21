import React from "react";
import Head from "next/head";
import {Inter} from "next/font/google";
import { Container, Table, Alert, Pagination } from "react-bootstrap";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";

const inter = Inter({subsets: ["latin"]});

type TUserItem = {
  id: number
  firstname: string
  lastname: string
  email: string
  phone: string
  updatedAt: string
}

type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  page: number;
  total: number;
  limit: number;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const page = parseInt(ctx.query.page as string) || 1;
  const limit = 20;

  try {
    const res = await fetch(`http://localhost:3000/users?page=${page}&limit=${limit}`, { method: 'GET' });
    if (!res.ok) {
      return { props: { statusCode: res.status, users: [], page, total: 0, limit } };
    }

    const data = await res.json();

    return {
      props: { statusCode: 200, users: data.users, page, total: data.total, limit }
    };
  } catch (e) {
    return { props: { statusCode: 500, users: [], page, total: 0, limit } };
  }
};

export default function Home({ statusCode, users, page, total, limit }: TGetServerSideProps) {
  const router = useRouter();

  if (statusCode !== 200) {
    return <Alert variant={'danger'}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  const pageCount = Math.ceil(total / limit);

  const MAX_DISPLAYED_PAGES = 5;
  let pages = [];

  // Добавление начальных страниц
  pages.push(1);
  if (page > MAX_DISPLAYED_PAGES + 1) {
    pages.push('...');
  }

  let startPage = Math.max(2, page - 2);
  let endPage = Math.min(pageCount - 1, page + 2);
  if (page - 1 <= 3) {
    endPage = 1 + MAX_DISPLAYED_PAGES;
  }
  if (pageCount - page <= 3) {
    startPage = pageCount - MAX_DISPLAYED_PAGES;
  }
  for (let p = startPage; p <= endPage; p++) {
    pages.push(p);
  }

  if (page < pageCount - (MAX_DISPLAYED_PAGES - 1)) {
    pages.push('...');
  }
  pages.push(pageCount);

  const handlePageClick = (pageNumber: number | string) => {
    if (pageNumber !== '...') {
      router.push(`/?page=${pageNumber}`);
    }
  };

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={'mb-5'}>Пользователи</h1>

          <Table striped bordered hover>
            <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
              <th>Email</th>
              <th>Дата обновления</th>
            </tr>
            </thead>
            <tbody>
            {
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))
            }
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {pages.map((p, idx) => (
              <React.Fragment key={idx}>
                {p === '...' ? (
                  <Pagination.Ellipsis />
                ) : (
                  <Pagination.Item
                    active={p === page}
                    onClick={() => handlePageClick(p)}
                  >
                    {p}
                  </Pagination.Item>
                )}
              </React.Fragment>
            ))}
          </Pagination>

        </Container>
      </main>
    </>
  );
}
