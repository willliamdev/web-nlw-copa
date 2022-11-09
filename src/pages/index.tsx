

interface HomeProps {
  poolCount: number
  guessCount: number
  usersCount: number

}

import Image from "next/image"
import appPreviewImg from "../assets/smartphones.png"
import logoImg from "../assets/logo.svg"
import checkIconImg from "../assets/check-icon.svg"
import usersAvatarExampleImg from "../assets/users-avatar-example.png"
import { api } from "../lib/axios"
import { FormEvent, useState } from "react"


export default function Home(props: HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent) {
    event.preventDefault()

    try {
      const response = await api.post('/pools', {
        title: poolTitle
      })

      const { code } = response.data
      await navigator.clipboard.writeText(code)
      setPoolTitle('')
      alert(`Bolão criado com sucesso! Código copiado pra área de transferencia! ${code} 📋`)

    } catch (err) {
      alert("Falha ao criar o bolão, tente novamente!")
    }

  }

  return (
    <div className="max-w-[1224px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>

        <Image src={logoImg} alt="Next Level Week: Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight" >
          Crie seu bolão da copa e compartilhe com seus amigos!
        </h1>

        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.usersCount}</span> pessoas já estão usando
          </strong>

        </div>

        <form
          onSubmit={createPool}
          className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border text-gray-100 border-gray-600 text-sm"
            type="text"
            required
            placeholder="Qual é o nome do seu bolão?"
            onChange={event => setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded font-bold text-gray-900 uppercase hover:bg-yellow-800"
            type="submit"
          >Criar meu bolão</button>
        </form>

        <p className="text-gray-400 mt-4 text-sm leading-relaxed">Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-100">

          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="Sinal de confirmação" />

            <div className=" " >
              <span className="text-2xl  font-bold block">+{props.poolCount}</span>
              <span >Bolões criados</span>
            </div>
          </div>

          <div className="bg-gray-600 w-px h-30" />

          <div className="flex items-center gap-6">
            <Image src={checkIconImg} alt="Sinal de confirmação" />

            <div className=" ">
              <span className="text-2xl font-bold block">+{props.guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>

      </main>

      <Image
        src={appPreviewImg}
        alt="Dois smartphones exibindo previa do applicativo"
        quality={100}
      />
    </div>
  )
}


export const getServerSideProps = async () => {

  const [
    poolCountResponse,
    guessCountResponse,
    usersCountResponse,
  ] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')

  ])

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      usersCount: usersCountResponse.data.count
    }
  }
}
