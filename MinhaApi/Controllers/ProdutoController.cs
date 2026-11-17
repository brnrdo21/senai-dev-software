
using Microsoft.AspNetCore.Mvc;
using MinhaApi.Models;
using MinhaApi.Services;
using Microsoft.AspNetCore.Authorization;

[ApiController]
[Route("api/[controller]")]
public class ProdutoController : ControllerBase
{
    private readonly IProdutoService _service;
    private readonly IFotoService _fotoService;

    public ProdutoController(
        IProdutoService service,
        IFotoService fotoService)
    {
        _service = service;
        _fotoService = fotoService;
    }

    // GET /api/produto
    [HttpGet]
    public IActionResult GetAll()
    {
        var produtos = _service.GetAll();

        var resultado = produtos.Select(p => new
        {
            p.Id,
            p.Nome,
            p.Preco,
            p.Estoque,
            p.Ativo,
            Foto = p.Foto,
            FotoBase64 = _fotoService.ConverterParaBase64(p.Foto)
        });

        return Ok(resultado);
    }

    // GET /api/produto/1
    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var produto = _service.GetById(id);

        if (produto == null)
            return NotFound();

        return Ok(new
        {
            produto.Id,
            produto.Nome,
            produto.Preco,
            produto.Estoque,
            produto.Ativo,
            Foto = produto.Foto,
            FotoBase64 = _fotoService.ConverterParaBase64(produto.Foto)
        });
    }

    // POST /api/produto
    [HttpPost]
    public IActionResult Create([FromBody] Produto produto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var criado = _service.Create(produto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = criado.Id },
            criado);
    }

    // PUT /api/produto/1
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Produto produto)
    {
        var atualizado = _service.Update(id, produto);

        if (atualizado == null)
            return NotFound();

        return Ok(new
        {
            atualizado.Id,
            atualizado.Nome,
            atualizado.Preco,
            atualizado.Estoque,
            atualizado.Ativo,
            Foto = atualizado.Foto,
            FotoBase64 = _fotoService.ConverterParaBase64(atualizado.Foto)
        });
    }

    // POST /api/produto/1/foto
    [HttpPost("{id}/foto")]
    public async Task<IActionResult> UploadFoto(
        int id,
        IFormFile foto)
    {
        var produto = _service.GetById(id);

        if (produto == null)
            return NotFound("Produto não encontrado.");

        if (foto == null || foto.Length == 0)
            return BadRequest("Selecione uma imagem.");

        string? fotoAntiga = produto.Foto;

        try
        {
            string? novoCaminho = await _fotoService.SalvarFoto(foto);

            produto.Foto = novoCaminho;

            var atualizado = _service.Update(id, produto);

            if (atualizado == null)
            {
                _fotoService.ExcluirFoto(novoCaminho);
                return NotFound("Produto não encontrado.");
            }

            // Exclui a foto antiga somente depois de salvar a nova
            _fotoService.ExcluirFoto(fotoAntiga);

            return Ok(new
            {
                atualizado.Id,
                atualizado.Nome,
                atualizado.Preco,
                atualizado.Estoque,
                atualizado.Ativo,
                Foto = atualizado.Foto,
                FotoBase64 = _fotoService.ConverterParaBase64(atualizado.Foto)
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    // DELETE /api/produto/1
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var produto = _service.GetById(id);

        if (produto == null)
            return NotFound();

        _fotoService.ExcluirFoto(produto.Foto);

        var deletado = _service.Delete(id);

        if (!deletado)
            return NotFound();

        return NoContent();
    }
}
